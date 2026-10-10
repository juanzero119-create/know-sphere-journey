import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

/**
 * Renders a component inside a real (memory-history) router so that anything
 * using <Link> — such as the beveled FilmChip tiles — can resolve its hrefs.
 */
export function renderWithRouter(ui: ReactElement) {
  const rootRoute = createRootRoute();
  const filmRoute = createRoute({ getParentRoute: () => rootRoute, path: '/film/$id' });
  const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: () => ui });
  const routeTree = rootRoute.addChildren([filmRoute, homeRoute]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
    context: { queryClient: new QueryClient() },
  });
  return render(<RouterProvider router={router}/>);
}
