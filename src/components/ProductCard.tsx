import { cn } from '#/lib/utils'
import { ShoppingBagIcon } from 'lucide-react'
import { Button } from './ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from './ui/card'
import { Link } from '@tanstack/react-router'
import type { ProductSelect } from '#/db/schema'

const inventoryTone = {
  'in-stock':
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-300',
  'out-of-stock':
    'border-red-200 bg-red-50 text-red-700 dark:border-red-800/70 dark:bg-red-950/40 dark:text-red-300',
  'pre-order':
    'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800/70 dark:bg-indigo-950/40 dark:text-indigo-300',
  'back-order':
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-300',
}

export function ProductCard({ product }: { product: ProductSelect }) {
  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className="cursor-pointer h-full hover:-translate-y-1 hover:shadow-lg transition"
    >
      <Card className="py-4">
        <div className="aspect-[5/3] overflow-hidden bg-muted">
          <img
            src={product.image || 'https://picsum.photos/seed/picsum/500/300'}
            alt={product.name}
            title={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover/card:scale-[1.02]"
          />
        </div>
        <CardHeader className="gap-2">
          <div className="flex items-center gap-2">
            {product.badge && (
              <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background">
                {product.badge}
              </span>
            )}
          </div>
          <CardTitle className="text-lg font-semibold">
            {product.name}
          </CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold">{product.rate}</span>
            <span className="text-muted-foreground/80">
              ({product.reviews} reviews)
            </span>
          </p>
          <span
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold',
              inventoryTone[product.inventory],
            )}
          >
            {product.inventory === 'in-stock'
              ? 'In Stock'
              : product.inventory === 'out-of-stock'
                ? 'Out of Stock'
                : product.inventory === 'pre-order'
                  ? 'Pre Order'
                  : 'Back Order'}
          </span>
        </CardContent>
        <CardFooter className="pt-0 flex items-center justify-between border-t-0 bg-transparent">
          <span className="text-lg font-bold">${product.price}</span>
          <Button
            size="sm"
            variant={'secondary'}
            className={'bg-foreground text-background hover:bg-foreground/90'}
            onClick={(e) => {
              console.log('add to card')
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            <ShoppingBagIcon size={16} /> Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
