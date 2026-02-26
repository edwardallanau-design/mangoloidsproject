import type { EnrichedGuildMember } from '@/types/raiderio';
import { getClassColor, getRoleIcon } from '@/constants/roster';

/**
 * Presentational member card component
 * No interactivity, no state
 */
export function MemberCard({ member }: { member: EnrichedGuildMember }) {
  const { character } = member;
  const classColor = getClassColor(character.class);
  const roleIcon = getRoleIcon(character.active_spec_role);

  return (
    <a
      href={character.profile_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-lg border border-primary/20 bg-primary/5 p-6 transition-all hover:border-primary/50 hover:bg-primary/10"
    >
      {/* Header: Class Name + Role */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {character.name}
          </h3>
          <p className="text-sm text-foreground/70">
            <span style={{ color: classColor }} className="font-medium">
              {character.class}
            </span>
            {character.active_spec_name && (
              <>
                {' '}
                • <span className="text-foreground/60">{character.active_spec_name}</span>
              </>
            )}
          </p>
          <p className="text-xs text-foreground/60">
            {character.race}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-2xl">{roleIcon}</div>
          <div className={`rounded-full px-2 py-1 text-xs font-semibold ${
            member.mythicPlusScore > 0
              ? 'bg-primary/20 text-primary'
              : 'bg-foreground/10 text-foreground/60'
          }`}>
            M+ {member.mythicPlusScore > 0 ? member.mythicPlusScore.toFixed(0) : 'None'}
          </div>
          {member.gearItemLevel && (
            <div className="rounded-full bg-accent/20 px-2 py-1 text-xs font-semibold text-accent">
              ilvl {member.gearItemLevel}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
