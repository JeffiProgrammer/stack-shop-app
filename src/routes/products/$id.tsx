import * as React from 'react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { createProductReview, fetchProductById } from '#/lib/product-queries'
import { createFileRoute, Link, notFound, useRouter } from '@tanstack/react-router'

import { ArrowLeftIcon, ShoppingBag, SparklesIcon, StarIcon } from 'lucide-react'

const inventoryTone = {
  'in-stock':
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-300',
  'out-of-stock':
    'border-red-200 bg-red-50 text-red-700 dark:border-red-800/70 dark:bg-red-950/40 dark:text-red-300',
  'pre-order':
    'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800/70 dark:bg-indigo-950/40 dark:text-indigo-300',
  'back-order':
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-300',
} as const

const inventoryLabel = {
  'in-stock': 'In Stock',
  'out-of-stock': 'Out of Stock',
  'pre-order': 'Pre Order',
  'back-order': 'Back Order',
} as const

const inventoryMessage = {
  'in-stock': 'Ready to ship in 1 to 2 business days.',
  'out-of-stock': 'Currently unavailable. Check back soon for the next restock.',
  'pre-order': 'Reserve it now and expect delivery in 2 to 3 weeks.',
  'back-order': 'Available on back-order and usually ships in about 2 weeks.',
} as const

export const Route = createFileRoute('/products/$id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const details = await fetchProductById({ data: params.id })
    if (!details || !details.product) {
      throw notFound()
    }
    return details
  },
  head: async ({ loaderData: details }) => {
    if (!details?.product) {
      return {}
    }

    const product = details.product

    return {
      meta: [
        {
          name: 'description',
          content: product.description,
        },
        {
          name: 'image',
          content: product.image?.toString(),
        },
        {
          name: 'title',
          content: product.name,
        },
        {
          title: product.name,
        },
        {
          description: product.description,
        },
      ],
    }
  },
})

function formatReviewDate(value: string | Date) {
  const dateValue = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(dateValue.getTime())) {
    return 'Recently'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateValue)
}

function RouteComponent() {
  const { product, reviews } = Route.useLoaderData()
  const router = useRouter()
  const productImage =
    product.image || 'https://picsum.photos/seed/picsum/1200/900'
  const [reviewerName, setReviewerName] = React.useState('')
  const [comment, setComment] = React.useState('')
  const [rating, setRating] = React.useState(5)
  const [submissionError, setSubmissionError] = React.useState<string | null>(null)
  const [submissionSuccess, setSubmissionSuccess] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const reviewCount = product.reviews ?? reviews.length
  const averageRating =
    product.rate === null || product.rate === undefined
      ? null
      : Number.parseFloat(product.rate.toString()).toFixed(1)

  const handleSubmitReview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmissionError(null)
    setSubmissionSuccess(null)

    startTransition(() => {
      void (async () => {
        try {
          await createProductReview({
            data: {
              productId: product.id,
              reviewerName,
              rating,
              comment,
            },
          })
          setComment('')
          setRating(5)
          setSubmissionSuccess('Review submitted successfully.')
          await router.invalidate()
        } catch (error) {
          setSubmissionError(
            error instanceof Error ? error.message : 'Unable to submit your review.',
          )
        }
      })()
    })
  }

  return (
    <section className="mx-auto max-w-6xl space-y-4">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-muted"
      >
        <ArrowLeftIcon size={16} />
        Back to products
      </Link>

      <Card className="overflow-hidden border border-border/70 bg-card/95 py-0 shadow-sm">
        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
          <div className="border-b border-border/70 bg-muted/30 p-5 sm:p-6 lg:border-r lg:border-b-0 lg:p-8">
            <div className="relative overflow-hidden rounded-[calc(var(--radius)*2)] border border-border/70 bg-background shadow-inner">
              <div className="absolute inset-0 bg-linear-to-br from-white/90 via-background to-muted/90 opacity-100 transition-opacity duration-300 dark:opacity-0" />
              <div className="absolute inset-0 bg-linear-to-br from-stone-950/95 via-stone-900/90 to-stone-800/85 opacity-0 transition-opacity duration-300 dark:opacity-100" />
              <div className="absolute inset-x-8 top-6 h-24 rounded-full bg-primary/12 blur-3xl" />
              <div className="absolute right-0 bottom-0 size-32 translate-x-1/4 translate-y-1/4 rounded-full bg-primary/10 blur-3xl" />
              <img
                src={productImage}
                alt={product.name}
                className="relative z-10 h-full w-full object-contain p-6 sm:p-10"
                loading="lazy"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <CardHeader className="gap-5 border-b border-border/70 px-5 pt-5 pb-5 sm:px-6 lg:px-8 lg:pt-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-semibold',
                        inventoryTone[product.inventory],
                      )}
                    >
                      {inventoryLabel[product.inventory]}
                    </span>
                    {product.badge && (
                      <span className="rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/15">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      <h1>{product.name}</h1>
                    </CardTitle>
                    <CardDescription className="max-w-2xl text-base leading-7 sm:text-lg">
                      {product.description}
                    </CardDescription>
                  </div>
                </div>

                <div className="min-w-40 rounded-2xl border border-border/70 bg-muted/35 px-4 py-4 text-left shadow-xs">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Price
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">
                    ${product.price}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-6 px-5 py-5 sm:px-6 sm:py-6 lg:px-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-xs">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Rating
                  </p>
                  <div className="mt-3 flex items-end gap-3">
                    <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                      <StarIcon size={20} className="fill-amber-400 text-amber-400" />
                      <span>{averageRating ?? 'N/A'}</span>
                    </div>
                    <span className="pb-1 text-sm text-muted-foreground">
                      {reviewCount} reviews
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-xs">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Availability
                  </p>
                  <p className="mt-3 text-base font-semibold">
                    {inventoryLabel[product.inventory]}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Stock state updates are reflected in real time.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <SparklesIcon size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Fulfillment
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {inventoryMessage[product.inventory]}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-stretch gap-3 border-t border-border/70 bg-muted/35 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <p className="text-sm text-muted-foreground">
                Free shipping on orders over $75.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="h-10 px-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <ShoppingBag size={16} />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="h-10 px-4 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  Add to Wishlist
                </Button>
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>

      <Card className="border border-border/70 bg-card/95 py-0 shadow-sm">
        <CardHeader className="border-b border-border/70 px-5 pt-5 pb-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Customer reviews
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                Read what buyers are saying and share your own experience.
              </CardDescription>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Average
              </p>
              <p className="mt-1 flex items-center gap-2 text-lg font-semibold">
                <StarIcon size={16} className="fill-amber-400 text-amber-400" />
                {averageRating ?? 'N/A'}
                <span className="text-sm font-medium text-muted-foreground">
                  ({reviewCount} total)
                </span>
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-5 py-5 sm:px-6 sm:py-6 lg:px-8">
          <form
            onSubmit={handleSubmitReview}
            className="space-y-4 rounded-2xl border border-border/70 bg-muted/25 p-4 sm:p-5"
          >
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
              <label className="space-y-2 text-sm">
                <span className="font-medium text-foreground">Your name</span>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(event) => {
                    setReviewerName(event.target.value)
                  }}
                  placeholder="Jane Doe"
                  required
                  minLength={2}
                  maxLength={60}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none ring-0 transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                />
              </label>

              <div className="space-y-2 text-sm">
                <span className="font-medium text-foreground">Rating</span>
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold transition',
                        rating === value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background text-muted-foreground hover:bg-muted',
                      )}
                      aria-pressed={rating === value}
                      title={`Set rating to ${value} star${value > 1 ? 's' : ''}`}
                    >
                      <StarIcon
                        size={13}
                        className={cn(
                          rating >= value
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-transparent text-muted-foreground',
                        )}
                      />
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-foreground">Comment</span>
              <textarea
                value={comment}
                onChange={(event) => {
                  setComment(event.target.value)
                }}
                placeholder="Tell others what you liked or what could be better."
                required
                minLength={8}
                maxLength={800}
                rows={4}
                className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-0 transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Reviews are published immediately after submission.
              </p>
              <Button type="submit" disabled={isPending} className="h-10 px-4">
                {isPending ? 'Submitting...' : 'Submit review'}
              </Button>
            </div>

            {submissionError && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {submissionError}
              </p>
            )}
            {submissionSuccess && !submissionError && (
              <p className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
                {submissionSuccess}
              </p>
            )}
          </form>

          {reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 bg-background/50 px-5 py-8 text-center text-sm text-muted-foreground">
              No reviews yet. Be the first to leave one for this product.
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="space-y-3 rounded-2xl border border-border/70 bg-background/65 p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {review.reviewerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatReviewDate(review.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <StarIcon
                          key={`${review.id}-star-${value}`}
                          size={14}
                          className={cn(
                            value <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-transparent text-muted-foreground',
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-foreground/90">{review.comment}</p>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
