import type { RaidBossProgression } from '@/types/raiderio';

/**
 * Displays raid progression for one raid tier across all three difficulties
 */
export function RaidProgressBar({
  raidSlug,
  progression,
}: {
  raidSlug: string;
  progression: RaidBossProgression;
}) {
  // Prettify slug: 'liberation-of-undermine' → 'Liberation Of Undermine'
  const raidName = raidSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const difficulties = [
    { label: 'Normal', killed: progression.normal_bosses_killed, color: 'bg-green-500' },
    { label: 'Heroic', killed: progression.heroic_bosses_killed, color: 'bg-blue-500' },
    { label: 'Mythic', killed: progression.mythic_bosses_killed, color: 'bg-primary' },
  ];

  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{raidName}</h3>

      <div className="space-y-3">
        {difficulties.map(({ label, killed, color }) => (
          <div key={label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground/80">
                {label}
              </span>
              <span className="text-foreground/60">
                {killed} / {progression.total_bosses}
              </span>
            </div>
            <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
              <div
                className={`h-full ${color} transition-all duration-300`}
                style={{
                  width: `${(killed / progression.total_bosses) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-foreground/50 pt-2">
        {progression.summary}
      </div>
    </div>
  );
}
