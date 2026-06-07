import { type MatchPublicDto } from '../../../shared/schemas/match';
import { type TournamentPublicDto } from '../../../shared/schemas/tournament';

export interface TournamentPreview {
  id: string;
  name: string;
  statusLabel: string;
  startDate: string;
  endDate: string;
  matchCount: number;
  teamsCount: number;
}

export interface MatchPreview {
  id: string;
  tournamentId: string;
  tournamentName: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  stage: string;
}

const statusLabels: Record<TournamentPublicDto['status'], string> = {
  active: 'Active',
  upcoming: 'Upcoming',
  completed: 'Completed',
  archived: 'Archived',
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const kickoffFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
  timeZoneName: 'short',
});

export function toTournamentPreview(
  tournament: TournamentPublicDto,
): TournamentPreview {
  return {
    id: tournament.id,
    name: tournament.name,
    statusLabel: statusLabels[tournament.status],
    startDate: dateFormatter.format(new Date(tournament.startDate)),
    endDate: dateFormatter.format(new Date(tournament.endDate)),
    matchCount: tournament.matchCount,
    teamsCount: tournament.teamsCount,
  };
}

export function toMatchPreview(match: MatchPublicDto): MatchPreview {
  return {
    id: match.id,
    tournamentId: match.tournamentId,
    tournamentName: match.tournamentName,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    kickoff: kickoffFormatter.format(new Date(match.kickoff)),
    stage: match.stage,
  };
}
