'use client';

import { useState } from 'react';
import type { RaidTeam } from '@/types/raid';
import { getClassColor, getRoleIcon } from '@/constants/roster';

/**
 * Displays one raid team with main roster (first 20) and collapsible bench
 */
export function RaidTeamCard({ team }: { team: RaidTeam }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showBench, setShowBench] = useState(false);

  const renderMemberRow = (member: typeof team.mainRoster[0]) => (
    <div
      key={member.name}
      className="flex items-center gap-3 px-4 py-2 border-b border-foreground/5 last:border-b-0"
    >
      <div className="text-lg w-6 text-center">{getRoleIcon(member.role)}</div>
      <a
        href={member.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        {member.name}
      </a>
      <span
        style={{ color: getClassColor(member.class) }}
        className="text-xs font-medium w-20 text-right"
      >
        {member.class}
      </span>
      {member.gearItemLevel && (
        <div className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent">
          ilvl {member.gearItemLevel}
        </div>
      )}
    </div>
  );

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 overflow-hidden">
      {/* Header - Clickable to minimize/expand */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-primary/10 transition-colors"
      >
        <div className="flex-1 text-left">
          <h3 className="text-lg font-semibold text-foreground">{team.name}</h3>
          {team.description && (
            <p className="text-sm text-foreground/60">{team.description}</p>
          )}
        </div>
        <div className="text-xl ml-4">{isMinimized ? '▼' : '▲'}</div>
      </button>

      {/* Content - Hidden when minimized */}
      {!isMinimized && (
        <div className="border-t border-primary/20 p-6 space-y-4">

      {/* Main Roster */}
      <div className="rounded border border-foreground/10">
        <div className="px-4 py-2 bg-foreground/5 border-b border-foreground/10">
          <span className="text-xs font-semibold text-foreground/70">
            Main Roster ({team.mainRoster.length})
          </span>
        </div>
        <div>{team.mainRoster.map(renderMemberRow)}</div>
      </div>

        {/* Bench Section */}
        {team.bench.length > 0 && (
          <div className="rounded border border-foreground/10">
            <button
              onClick={() => setShowBench(!showBench)}
              className="w-full px-4 py-2 bg-foreground/5 border-b border-foreground/10 flex items-center justify-between hover:bg-foreground/10 transition-colors"
            >
              <span className="text-xs font-semibold text-foreground/70">
                Bench / Reserve ({team.bench.length})
              </span>
              <span className="text-xs">{showBench ? '▲' : '▼'}</span>
            </button>
            {showBench && <div>{team.bench.map(renderMemberRow)}</div>}
          </div>
        )}
        </div>
      )}
    </div>
  );
}
