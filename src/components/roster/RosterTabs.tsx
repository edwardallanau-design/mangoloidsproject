'use client';

import { useState } from 'react';
import type { EnrichedGuildMember } from '@/types/raiderio';
import type { RaidProgression } from '@/types/raiderio';
import type { RaidTeam } from '@/types/raid';
import { RosterClient } from './RosterClient';
import { RaidRosterClient } from './RaidRosterClient';

type RosterTab = 'mythic-plus' | 'raid';

/**
 * Tab switcher between Mythic+ and Raid rosters
 */
export function RosterTabs({
  members,
  availableClasses,
  teams,
  progression,
}: {
  members: EnrichedGuildMember[];
  availableClasses: string[];
  teams: RaidTeam[];
  progression: RaidProgression;
}) {
  const [activeTab, setActiveTab] = useState<RosterTab>('raid');

  return (
    <div className="space-y-8">
      {/* Tab Buttons */}
      <div className="flex gap-2 border-b border-primary/20">
        <button
          onClick={() => setActiveTab('raid')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'raid'
              ? 'border-primary text-primary'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          🛡️ Raid
        </button>
        <button
          onClick={() => setActiveTab('mythic-plus')}
          className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
            activeTab === 'mythic-plus'
              ? 'border-primary text-primary'
              : 'border-transparent text-foreground/60 hover:text-foreground'
          }`}
        >
          ⚔️ Mythic+
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'mythic-plus' && (
        <RosterClient members={members} availableClasses={availableClasses} />
      )}

      {activeTab === 'raid' && <RaidRosterClient teams={teams} progression={progression} />}
    </div>
  );
}
