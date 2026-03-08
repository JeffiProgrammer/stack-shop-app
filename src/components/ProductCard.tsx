import { cn } from '#/lib/utils'
import { ShoppingBagIcon } from 'lucide-react'
import { Button } from './ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardAction,
  CardFooter,
} from './ui/card'
import { Link } from '@tanstack/react-router'

const inventoryTone = {
  'in-stock': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  'out-of-stock': 'bg-red-50 text-red-600 border-red-100',
  'pre-order': 'bg-indigo-50 text-indigo-700 border-indogo-100',
  'back-order': 'bg-amber-50 text-amber-700 border-amber-100',
}

export function ProductCard({
  product,
}: {
  product: {
    name: string
    description: string
    price: number
    badge?: string
    rate: number
    reviews: number
    image: string
    inventory: string
  }
}) {
  return (
    <Link
      to="/products/$id"
      params={{ id: '1' }}
      className="cursor-pointer h-full hover:-translate-y-1 hover:shadow-lg transition"
    >
      <Card className="px-4 py-4">
        <CardHeader className="gap-2">
          <div className="flex items-center gap-2">
            {product.badge && (
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-semibold text-white">
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
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-semibold">{product.rate}</span>
            <span className="text-slate-400">({product.reviews} reviews)</span>
          </p>
          <span
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold',
              inventoryTone[product.inventory as keyof typeof inventoryTone],
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
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          <Button
            size="sm"
            variant={'secondary'}
            className={'bg-slate-900 text-white hover:bg-slate-800'}
            onClick={(e) => {
              console.log('add to card')
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            <ShoppingBagIcon size={16} /> Add to Card
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
