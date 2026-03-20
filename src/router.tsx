import { createRouter as createTanStackRouter, Link } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,

    scrollRestoration: true,
    defaultPreload: 'intent', // preload all the links when user hovers or focuses them
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => {
      return (
        <div>
          <p>Not Found Page</p>
          <Link to="/">Go Home</Link>
        </div>
      )
    },
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
