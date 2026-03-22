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
    const { getProductByID } = await import('#/data/products')
    return getProductByID(id)
  })
