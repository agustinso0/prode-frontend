import { Route, Routes } from 'react-router-dom';

import { LandingPage } from '../features/landing/pages/LandingPage';
import { ROUTE_PATHS } from './routeMap';

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.public.home} element={<LandingPage />} />
    </Routes>
  );
}
