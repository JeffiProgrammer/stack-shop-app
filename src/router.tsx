import {
  createRouter as createTanStackRouter,
  Link,
} from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const queryClient = new QueryClient()

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
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

  setupRouterSsrQueryIntegration({ router, queryClient })
   
  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
