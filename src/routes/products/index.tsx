import { ProductCard } from '#/components/ProductCard'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { fetchProducts } from '#/lib/product-queries'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/products/')({
  component: RouteComponent,
  loader: async () => {
    return fetchProducts()
  },
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
