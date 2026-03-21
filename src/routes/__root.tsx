import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Header from '../components/Header'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var theme=stored==='dark'?'dark':'light';var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(theme);root.setAttribute('data-theme',theme);root.style.colorScheme=theme;}catch(e){}})();`

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'Stack-Shop app',
        },
        {
          description:
            'Stack-Shop app is a platform for buying and selling products.',
        },
      ],
      links: [
        {
          rel: 'stylesheet',
          href: appCss,
        },
      ],
    }),
    shellComponent: RootDocument,
  },
)

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <main className="w-full px-4 py-6 sm:px-6 xl:px-8">
            {children}
          </main>
        </div>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <ReactQueryDevtools />
        <Scripts />
      </body>
    </html>
  )
}
