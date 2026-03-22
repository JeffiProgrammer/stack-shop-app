import { createServerFn } from '@tanstack/react-start'

export const fetchProducts = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getAllProducts } = await import('#/data/products')
    return getAllProducts()
  },
)

export const fetchRecommendedProducts = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { getRecommendedProducts } = await import('#/data/products')
  return getRecommendedProducts()
})

export const fetchProductById = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { getProductDetailsWithReviews } = await import('#/data/products')
    return getProductDetailsWithReviews(id)
  })

type CreateProductReviewInput = {
  productId: string
  reviewerName: string
  rating: number
  comment: string
}

export function validateCreateProductReviewInput(
  input: CreateProductReviewInput | unknown,
) {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid review payload.')
  }

  const payload = input as Partial<CreateProductReviewInput>
  const reviewerName = (payload.reviewerName ?? '').trim()
  const comment = (payload.comment ?? '').trim()
  const rating = Number(payload.rating)
  const productId = (payload.productId ?? '').trim()

  if (productId.length === 0) {
    throw new Error('Invalid product ID.')
  }

  if (reviewerName.length < 2 || reviewerName.length > 60) {
    throw new Error('Reviewer name must be between 2 and 60 characters.')
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Rating must be an integer from 1 to 5.')
  }

  if (comment.length < 8 || comment.length > 800) {
    throw new Error('Comment must be between 8 and 800 characters.')
  }

  return {
    productId,
    reviewerName,
    rating,
    comment,
  }
}

export const createProductReview = createServerFn({ method: 'POST' })
  .inputValidator(validateCreateProductReviewInput)
  .handler(async ({ data }) => {
    const { createReview } = await import('#/data/products')
    return createReview(data)
  })
