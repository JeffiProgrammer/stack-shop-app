import { describe, expect, it } from 'vitest'
import { validateCreateProductReviewInput } from './product-queries'

describe('validateCreateProductReviewInput', () => {
  it('returns sanitized review data for valid input', () => {
    const result = validateCreateProductReviewInput({
      productId: '  product-id  ',
      reviewerName: '  Jane Doe  ',
      rating: 5,
      comment: '  This product is excellent and works as expected.  ',
    })

    expect(result).toEqual({
      productId: 'product-id',
      reviewerName: 'Jane Doe',
      rating: 5,
      comment: 'This product is excellent and works as expected.',
    })
  })

  it('rejects ratings outside 1..5', () => {
    expect(() =>
      validateCreateProductReviewInput({
        productId: 'product-id',
        reviewerName: 'Jane Doe',
        rating: 0,
        comment: 'Solid quality and good value.',
      }),
    ).toThrow('Rating must be an integer from 1 to 5.')
  })

  it('rejects too-short comments', () => {
    expect(() =>
      validateCreateProductReviewInput({
        productId: 'product-id',
        reviewerName: 'Jane Doe',
        rating: 4,
        comment: 'Nice',
      }),
    ).toThrow('Comment must be between 8 and 800 characters.')
  })
})
