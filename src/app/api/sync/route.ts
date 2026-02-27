/**
 * Guild data sync endpoint
 * Fetches fresh data from Raider.io and stores it in Supabase.
 *
 * Called by Vercel Cron every 6 hours (vercel.json).
 * Can also be called manually: GET /api/sync with Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/db/supabase';
import { fetchGuildProfile } from '@/lib/raiderio/guild';
import { fetchCharacterDetail } from '@/lib/raiderio/character';
import { GUILD_REGION } from '@/constants/raiderio';
import type { GuildMemberRow, RaidProgressionRow } from '@/lib/db/types';
import type { CharacterDetail, GuildMember } from '@/types/raiderio';

export async function GET(request: NextRequest) {
  // Verify CRON_SECRET to prevent unauthorized syncs
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const syncedAt = new Date().toISOString();

    // ── Step 1: Fetch guild roster from Raider.io ─────────────────────────
    const guildProfile = await fetchGuildProfile('members,raid_progression,raid_rankings');
    const allMembers: GuildMember[] = guildProfile.members ?? [];

    // Filter out members without class/race data
    const rioMembers = allMembers.filter(
      m => m.character.class && m.character.race
    );

    // ── Step 2: Enrich each member with Raider.io character details ───────
    const characterDetails = await Promise.allSettled(
      rioMembers.map(m => fetchCharacterDetail(m.character.name, m.character.realm)),
    );

    // ── Step 3: Build rows for upsert ─────────────────────────────────────
    const memberRows: GuildMemberRow[] = rioMembers.map((member, index) => {
      const result = characterDetails[index];
      let mythicPlusScore = 0;
      let gearItemLevel: number | null = null;
      let activeSpecName: string | null = member.character.active_spec_name ?? null;
      let activeSpecRole: string | null = member.character.active_spec_role ?? null;

      if (result.status === 'fulfilled') {
        const detail = result.value as CharacterDetail;

        activeSpecName = detail.active_spec_name;
        activeSpecRole = detail.active_spec_role;

        // Current season M+ score only (exclude preseason/postseason)
        const scores = detail.mythic_plus_scores_by_season;
        if (Array.isArray(scores) && scores.length > 0) {
          const currentSeason = scores.find(
            s => !s.season.toLowerCase().includes('preseason') &&
                 !s.season.toLowerCase().includes('postseason')
          ) ?? scores[0];
          mythicPlusScore = currentSeason?.scores?.all ?? 0;
        }

        if (detail.gear?.item_level_equipped) {
          gearItemLevel = detail.gear.item_level_equipped;
        }
      } else {
        console.error(`[Sync] Raider.io fetch failed for ${member.character.name}:`, result.reason);
      }

      return {
        name: member.character.name,
        class: member.character.class,
        race: member.character.race,
        region: GUILD_REGION,
        realm: member.character.realm,
        rank: member.rank,
        active_spec_name: activeSpecName,
        active_spec_role: activeSpecRole,
        profile_url: member.character.profile_url,
        mythic_plus_score: mythicPlusScore,
        gear_item_level: gearItemLevel,
        synced_at: syncedAt,
      };
    });

    // ── Step 4: Upsert guild members ──────────────────────────────────────
    // Deduplicate by name — Raider.io can return the same character twice
    // (e.g. alts on different realms). Keep the lowest rank (highest standing).
    const uniqueMembers = Array.from(
      memberRows.reduce((map, row) => {
        const existing = map.get(row.name);
        if (!existing || row.rank < existing.rank) map.set(row.name, row);
        return map;
      }, new Map<string, GuildMemberRow>()).values()
    );

    const supabase = getSupabase();
    const { error: membersError } = await supabase
      .from('guild_members')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .upsert(uniqueMembers as any[], { onConflict: 'name' });

    if (membersError) throw new Error(`Members upsert failed: ${membersError.message}`);

    // ── Step 5: Upsert raid progression ───────────────────────────────────
    const progression = guildProfile.raid_progression ?? {};

    const progressionRows: RaidProgressionRow[] = Object.entries(progression).map(
      ([slug, data]) => ({
        raid_slug: slug,
        summary: data.summary,
        normal_bosses_killed: data.normal_bosses_killed,
        heroic_bosses_killed: data.heroic_bosses_killed,
        mythic_bosses_killed: data.mythic_bosses_killed,
        total_bosses: data.total_bosses,
        synced_at: syncedAt,
      })
    );

    if (progressionRows.length > 0) {
      const { error: progressionError } = await supabase
        .from('raid_progression')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .upsert(progressionRows as any[], { onConflict: 'raid_slug' });

      if (progressionError) throw new Error(`Progression upsert failed: ${progressionError.message}`);
    }

    console.log(`[Sync] Done — ${uniqueMembers.length} members (${memberRows.length - uniqueMembers.length} dupes dropped), ${progressionRows.length} raid rows`);

    return NextResponse.json({
      success: true,
      members: uniqueMembers.length,
      raid_raids: progressionRows.length,
      synced_at: syncedAt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Sync] Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
