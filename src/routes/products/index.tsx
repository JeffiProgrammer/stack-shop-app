import { ProductCard } from '#/components/ProductCard'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { getAllProducts } from '#/data/products'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createMiddleware, createServerFn } from '@tanstack/react-start'

const loggerMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const source =
      request.headers.get('origin') ?? request.headers.get('host') ?? 'unknown'

    console.log('---loggerMiddleware---', request.url, 'source:', source)
    return next()
  },
)

const fetchProducts = createServerFn({ method: 'GET' })
  .middleware([loggerMiddleware])
  .handler(async() => {
    return await getAllProducts()
  })

export const Route = createFileRoute('/products/')({
  component: RouteComponent,
  loader: async () => {
    console.log("--LOADER--")
    return fetchProducts()
  }
})

function RouteComponent() {
  const products = Route.useLoaderData()
  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    initialData: products,
  })
  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <Card className="bg-card/80 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardHeader className="px-0">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">
                  StartShop Catalog
                </p>
                <CardTitle className="text-2xl font-semibold">
                  Products build for makers
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-sm">
                Browse a minimal, production-flavoured catalog with TanStack
                Start server functions and typed routes.
              </CardDescription>
            </div>
          </div>
        </Card>
      </section>
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {data.map((product, index) => (
            <ProductCard key={`product-${index}`} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
