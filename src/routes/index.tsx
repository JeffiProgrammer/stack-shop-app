import { ProductCard } from '#/components/ProductCard'
import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
} from '#/components/ui/card'
import { sampleProducts } from '#/db/seed'
import { createFileRoute, Link } from '@tanstack/react-router'

import { ArrowRightIcon } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    return { products: sampleProducts.slice(0, 3) }
  },
})

async function App() {
  const { products } = Route.useLoaderData()

  return (
    <div className="space-y-12 bg-linear-to-b from-background via-background to-muted/40 p-6">
      <section>
        <Card className="bg-card/80 p-8 shadow-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Your favourite e-commerce store
          </p>
          <CardTitle className="max-w-2xl text-4xl font-bold leading-tight">
            <h1>StartShop - Your one-stop shop for all your needs</h1>
          </CardTitle>
          <CardDescription>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-lg transition hover:-translate-y-0.5 hover:bg-foreground/90
              hover:shadow-xl"
            >
              Browse products
              <ArrowRightIcon size={16} />
            </Link>
          </CardDescription>
        </Card>
      </section>
      <section className="space-y-4">
        <Card className="bg-card/80 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <CardHeader className="px-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Recommended
                </p>
                <CardTitle className="text-2xl font-semibold">
                  Starter picks from the catalog
                </CardTitle>
              </CardHeader>
              <CardDescription className="text-sm">
                Created items to try the cart and detail page quickly.
              </CardDescription>
            </div>
            <div>
              <Link
                to="/products"
                className="hidden items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-semibold text-foreground transition hover:-translate-y-0.5 hover:bg-muted
                hover:shadow-xl sm:inline-flex"
              >
                View All <ArrowRightIcon size={14} />
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={`product-${index}`} product={product} />
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}
