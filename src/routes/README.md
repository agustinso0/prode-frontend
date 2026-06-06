# Routes

The central route tree lives here. This directory owns URL paths, route guards, route-level layouts, and mapping routes to feature pages.

Feature pages are imported into routes; features do not register routes themselves.

`routeMap.ts` contains the proposed route constants and ownership metadata. `AppRoutes.tsx` should only mount routes that are actually implemented.
