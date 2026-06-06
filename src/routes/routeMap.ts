export type RouteGroup =
  | 'public'
  | 'auth'
  | 'app'
  | 'league'
  | 'leagueAdmin'
  | 'systemAdmin'
  | 'notFound';

export type RouteOwner =
  | 'routes'
  | 'landing'
  | 'auth'
  | 'leagues'
  | 'tournaments'
  | 'predictions'
  | 'rankings'
  | 'profile'
  | 'admin'
  | 'future';

export type AuthState =
  | 'unauthenticated'
  | 'authenticating'
  | 'authenticated'
  | 'onboardingRequired'
  | 'forbidden';

export interface AppRouteDefinition {
  path: string;
  group: RouteGroup;
  owner: RouteOwner;
  mvp: boolean;
}

export const ROUTE_PATHS = {
  public: {
    home: '/',
    tournaments: '/tournaments',
    upcomingMatches: '/matches/upcoming',
    login: '/login',
    invite: '/invite/:inviteCode',
  },
  auth: {
    callback: '/auth/callback',
    error: '/auth/error',
  },
  app: {
    home: '/app',
    onboarding: '/app/onboarding',
    profile: '/app/profile',
    newLeague: '/app/leagues/new',
    joinLeague: '/app/leagues/join',
  },
  league: {
    home: '/app/leagues/:leagueId',
    tournaments: '/app/leagues/:leagueId/tournaments',
    tournament: '/app/leagues/:leagueId/tournaments/:tournamentId',
    predictions: '/app/leagues/:leagueId/tournaments/:tournamentId/predictions',
    tournamentRanking:
      '/app/leagues/:leagueId/tournaments/:tournamentId/rankings',
    historicalRanking: '/app/leagues/:leagueId/rankings/history',
  },
  leagueAdmin: {
    home: '/app/leagues/:leagueId/admin',
    members: '/app/leagues/:leagueId/admin/members',
    invitations: '/app/leagues/:leagueId/admin/invitations',
    tournaments: '/app/leagues/:leagueId/admin/tournaments',
    rules: '/app/leagues/:leagueId/admin/tournaments/:tournamentId/rules',
  },
  systemAdmin: {
    home: '/admin',
    tournaments: '/admin/tournaments',
    fixtures: '/admin/tournaments/:tournamentId/fixtures',
    results: '/admin/tournaments/:tournamentId/results',
  },
  future: {
    notifications: '/notifications',
    leagueChat: '/app/leagues/:leagueId/chat',
  },
  notFound: '*',
} as const;

export const APP_ROUTE_MAP = [
  {
    path: ROUTE_PATHS.public.home,
    group: 'public',
    owner: 'landing',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.public.tournaments,
    group: 'public',
    owner: 'tournaments',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.public.upcomingMatches,
    group: 'public',
    owner: 'tournaments',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.public.login,
    group: 'public',
    owner: 'auth',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.auth.callback,
    group: 'auth',
    owner: 'auth',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.auth.error,
    group: 'auth',
    owner: 'auth',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.public.invite,
    group: 'public',
    owner: 'leagues',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.app.home,
    group: 'app',
    owner: 'leagues',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.app.onboarding,
    group: 'app',
    owner: 'profile',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.app.profile,
    group: 'app',
    owner: 'profile',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.app.newLeague,
    group: 'app',
    owner: 'leagues',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.app.joinLeague,
    group: 'app',
    owner: 'leagues',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.league.home,
    group: 'league',
    owner: 'leagues',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.league.tournaments,
    group: 'league',
    owner: 'tournaments',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.league.tournament,
    group: 'league',
    owner: 'tournaments',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.league.predictions,
    group: 'league',
    owner: 'predictions',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.league.tournamentRanking,
    group: 'league',
    owner: 'rankings',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.league.historicalRanking,
    group: 'league',
    owner: 'rankings',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.leagueAdmin.home,
    group: 'leagueAdmin',
    owner: 'leagues',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.leagueAdmin.members,
    group: 'leagueAdmin',
    owner: 'leagues',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.leagueAdmin.invitations,
    group: 'leagueAdmin',
    owner: 'leagues',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.leagueAdmin.tournaments,
    group: 'leagueAdmin',
    owner: 'tournaments',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.leagueAdmin.rules,
    group: 'leagueAdmin',
    owner: 'tournaments',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.systemAdmin.home,
    group: 'systemAdmin',
    owner: 'admin',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.systemAdmin.tournaments,
    group: 'systemAdmin',
    owner: 'admin',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.systemAdmin.fixtures,
    group: 'systemAdmin',
    owner: 'admin',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.systemAdmin.results,
    group: 'systemAdmin',
    owner: 'admin',
    mvp: true,
  },
  {
    path: ROUTE_PATHS.future.notifications,
    group: 'app',
    owner: 'future',
    mvp: false,
  },
  {
    path: ROUTE_PATHS.future.leagueChat,
    group: 'league',
    owner: 'future',
    mvp: false,
  },
  {
    path: ROUTE_PATHS.notFound,
    group: 'notFound',
    owner: 'routes',
    mvp: true,
  },
] as const satisfies readonly AppRouteDefinition[];
