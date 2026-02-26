'use client';

import { useState, useMemo } from 'react';
import type { EnrichedGuildMember } from '@/types/raiderio';
import type { RosterFilters, RoleFilter } from '@/types/roster';
import { MemberCard } from './MemberCard';

interface RosterClientProps {
  members: EnrichedGuildMember[];
  availableClasses: string[];
}

/**
 * Client-side roster filter component
 * Manages all filter state and renders the roster grid
 */
export function RosterClient({
  members,
  availableClasses,
}: RosterClientProps) {
  const [filters, setFilters] = useState<RosterFilters>({
    search: '',
    role: null,
    selectedClasses: [],
    mythicPlusOnly: true,
  });

  // Apply all filters
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const { character } = m;

      // Filter by M+ only
      if (filters.mythicPlusOnly && m.mythicPlusScore === 0) {
        return false;
      }

      // Search by name (case-insensitive)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!character.name.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filter by role
      if (filters.role !== null) {
        if (character.active_spec_role !== filters.role) {
          return false;
        }
      }

      // Filter by selected classes
      if (filters.selectedClasses.length > 0) {
        if (!filters.selectedClasses.includes(character.class)) {
          return false;
        }
      }

      return true;
    });
  }, [members, filters]);

  // Check if any filter is active
  const hasActiveFilters =
    filters.search !== '' ||
    filters.role !== null ||
    filters.selectedClasses.length > 0;

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      role: null,
      selectedClasses: [],
      mythicPlusOnly: true,
    });
  };

  // Toggle class filter
  const toggleClass = (className: string) => {
    setFilters(prev => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(className)
        ? prev.selectedClasses.filter(c => c !== className)
        : [...prev.selectedClasses, className],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 space-y-6">
        {/* M+ Runners Only Toggle */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Filters</label>
          <button
            onClick={() => setFilters(prev => ({ ...prev, mythicPlusOnly: !prev.mythicPlusOnly }))}
            className={`w-full rounded-lg px-4 py-3 font-medium transition-colors flex items-center justify-between ${
              filters.mythicPlusOnly
                ? 'bg-primary text-white'
                : 'border border-primary/30 text-foreground hover:border-primary/60 hover:bg-primary/10'
            }`}
          >
            <span>✦ Mythic+ Runners Only</span>
            <span className="text-sm">{filters.mythicPlusOnly ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div>
          <label htmlFor="search" className="block text-sm font-semibold text-foreground mb-2">
            Search by Name
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search members..."
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full rounded-lg border border-primary/20 bg-background px-4 py-2 text-foreground placeholder-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Role</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, role: null }))}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                filters.role === null
                  ? 'bg-primary text-white'
                  : 'border border-primary/30 text-foreground hover:border-primary/60 hover:bg-primary/10'
              }`}
            >
              All
            </button>
            {(['TANK', 'HEALING', 'DPS'] as const).map(role => (
              <button
                key={role}
                onClick={() => setFilters(prev => ({ ...prev, role: filters.role === role ? null : role }))}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  filters.role === role
                    ? 'bg-primary text-white'
                    : 'border border-primary/30 text-foreground hover:border-primary/60 hover:bg-primary/10'
                }`}
              >
                {role === 'TANK' && '🛡️'} {role === 'HEALING' && '✨'} {role === 'DPS' && '⚔️'} {role}
              </button>
            ))}
          </div>
        </div>

        {/* Class Filter */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Class</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, selectedClasses: [] }))}
              className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                filters.selectedClasses.length === 0
                  ? 'bg-primary text-white'
                  : 'border border-primary/30 text-foreground hover:border-primary/60 hover:bg-primary/10'
              }`}
            >
              All
            </button>
            {availableClasses.map(className => (
              <button
                key={className}
                onClick={() => toggleClass(className)}
                className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
                  filters.selectedClasses.includes(className)
                    ? 'bg-primary text-white'
                    : 'border border-primary/30 text-foreground hover:border-primary/60 hover:bg-primary/10'
                }`}
              >
                {className}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full rounded-lg border border-accent/30 bg-accent/10 px-4 py-2 font-medium text-accent transition-colors hover:border-accent/60 hover:bg-accent/20"
          >
            Clear All Filters
          </button>
        )}

        {/* Results Count */}
        <div className="text-center text-sm text-foreground/70">
          Showing {filteredMembers.length} of {members.length} members
        </div>
      </div>

      {/* Roster Grid */}
      {filteredMembers.length === 0 ? (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
          <p className="text-foreground/70 text-lg">No members match your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-primary hover:text-primary/80 underline"
          >
            Clear filters to see all members
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map(member => (
            <MemberCard key={member.character.profile_url} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
