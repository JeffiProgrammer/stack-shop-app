import { db } from '@/db'
import type { ProductReviewSelect } from '@/db/schema'
import { productReviews, products } from '@/db/schema'
import { desc, eq, sql } from 'drizzle-orm'

export async function getAllProducts() {
  try {
    const dbProductsData = await db.select().from(products)
    return dbProductsData
  } catch (error) {
    console.error('Failed to fetch products', error)
    return []
  }
}

export async function getRecommendedProducts() {
  try {
    const dbProductsData = await db.select().from(products).limit(5)
    return dbProductsData
  } catch (error) {
    console.error('Failed to fetch recommended products', error)
    return []
  }
}

export async function getProductByID(id: string) {
  try {
    const productData = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1)
    return productData[0] || null
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}`, error)
    return null
  }
}

export type ProductDetailsWithReviews = {
  product: NonNullable<Awaited<ReturnType<typeof getProductByID>>>
  reviews: ProductReviewSelect[]
}

export async function getProductDetailsWithReviews(
  id: string,
): Promise<ProductDetailsWithReviews | null> {
  try {
    const product = await getProductByID(id)
    if (!product) {
      return null
    }

    const reviews = await db
      .select()
      .from(productReviews)
      .where(eq(productReviews.productId, id))
      .orderBy(desc(productReviews.createdAt))

    return { product, reviews }
  } catch (error) {
    console.error(`Failed to fetch product details with reviews for ID ${id}`, error)
    return null
  }
}

type NewReviewInput = {
  productId: string
  reviewerName: string
  rating: number
  comment: string
}

type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0]

async function updateProductReviewAggregates(
  tx: TransactionClient,
  productId: string,
) {
  const [aggregate] = await tx
    .select({
      average: sql<string | null>`avg(${productReviews.rating})`,
      total: sql<number>`count(*)::int`,
    })
    .from(productReviews)
    .where(eq(productReviews.productId, productId))

  const reviewsCount = aggregate?.total ?? 0
  const rateValue =
    aggregate?.average === null || aggregate?.average === undefined
      ? null
      : Number.parseFloat(aggregate.average).toFixed(2)

  await tx
    .update(products)
    .set({
      rate: rateValue,
      reviews: reviewsCount,
    })
    .where(eq(products.id, productId))

  return {
    rate: rateValue,
    reviews: reviewsCount,
  }
}

export async function createReview(input: NewReviewInput) {
  const createdReview = await db.transaction(async (tx) => {
    const [insertedReview] = await tx
      .insert(productReviews)
      .values({
        productId: input.productId,
        reviewerName: input.reviewerName,
        rating: input.rating,
        comment: input.comment,
      })
      .returning()

    if (!insertedReview) {
      throw new Error('Failed to create review.')
    }

    const aggregates = await updateProductReviewAggregates(tx, input.productId)

    return {
      review: insertedReview,
      aggregates,
    }
  })

  return createdReview
}
