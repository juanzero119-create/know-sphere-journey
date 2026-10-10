import { QueryClient } from '@tanstack/react-query';
import { createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider } from '@tanstack/react-router';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';

/**
 * Renders a component inside a real (memory-history) router, already loaded, so
 * that anything using <Link> — such as the beveled FilmChip tiles — can resolve
 * its hrefs. Await it in the test body.
 */
export async function renderWithRouter(ui: ReactElement) {
  const rootRoute = createRootRoute({ component: () => <Outlet/> });
  const filmRoute = createRoute({ getParentRoute: () => rootRoute, path: '/film/$id' });
  const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: () => ui });
  const routeTree = rootRoute.addChildren([filmRoute, homeRoute]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
    context: { queryClient: new QueryClient() },
  });
  await router.load();
  return render(<RouterProvider router={router}/>);
}
