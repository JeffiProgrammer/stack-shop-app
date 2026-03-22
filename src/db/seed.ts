import dotenv from 'dotenv'
import { eq } from 'drizzle-orm'
import type { ProductInsert, ProductReviewInsert } from './schema'

dotenv.config()

// Set environment variables for Nitro and Node.js
// process.env.NITRO_PRESET = 'bun'
// process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const sampleProducts: ProductInsert[] = [
  {
    name: 'Product 1',
    description: 'Description for Product 1',
    price: '19.99',
    badge: 'New',
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 2',
    description: 'Description for Product 2',
    price: '29.99',
    badge: 'Sale',
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 3',
    description: 'Description for Product 3',
    price: '39.99',
    badge: 'Limited',
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'out-of-stock',
  },
  {
    name: 'Product 4',
    description: 'Description for Product 4',
    price: '49.99',
    badge: 'Exclusive',
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 5',
    description: 'Description for Product 5',
    price: '59.99',
    badge: 'Best Seller',
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 6',
    description: 'Description for Product 6',
    price: '69.99',
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 7',
    description: 'Description for Product 7',
    price: '79.99',
    badge: 'Sale',
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 8 ',
    description: 'Description for Product 8',
    price: '89.99',
    badge: 'Limited',
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'out-of-stock',
  },
  {
    name: 'Product 9',
    description: 'Description for Product 9',
    price: '99.99',
    badge: 'Exclusive',
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 10',
    description: 'Description for Product 10',
    price: '109.99',
    badge: 'Best Seller',
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 11',
    description: 'Description for Product 11',
    price: '119.99',
    badge: 'New',
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'pre-order',
  },
  {
    name: 'Product 12',
    description: 'Description for Product 12',
    price: '129.99',
    badge: 'Sale',
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'back-order',
  },
]

const reviewerNames = [
  'Maya',
  'Aria',
  'Noah',
  'Oliver',
  'Ava',
  'Liam',
  'Sophia',
  'Mason',
  'Ethan',
  'Emma',
]

const reviewComments = [
  'Build quality feels premium and the product works exactly as expected.',
  'Packaging was clean, shipping was quick, and setup took less than five minutes.',
  'Great value for the price. I would buy this again without hesitation.',
  'Solid product overall, but I wish the instructions had a bit more detail.',
  'The finish and materials are better than I expected at this price point.',
  'Good performance and easy to use day-to-day. No major complaints so far.',
  'Customer support was responsive and helped me with a small setup issue quickly.',
  'Looks great on my desk and does exactly what I needed it to do.',
]

const reviewRatings = [5, 4, 4, 5, 3, 5, 4, 5]

function buildSeedReviews(productId: string, productIndex: number): ProductReviewInsert[] {
  return [0, 1, 2].map((offset) => {
    const lookupIndex = (productIndex + offset) % reviewComments.length
    return {
      productId,
      reviewerName: reviewerNames[(productIndex + offset) % reviewerNames.length],
      rating: reviewRatings[lookupIndex],
      comment: reviewComments[lookupIndex],
    }
  })
}

async function seed() {
  try {
    // Dynamically import database modules after environment variables are loaded
    const { db } = await import('./index')
    const { products, productReviews } = await import('./schema')

    console.log('🍃 Seeding database with sample products...')

    // Check if --reset flag is passed
    const shouldReset =
      process.argv.includes('--reset') || process.argv.includes('-r')

    if (shouldReset) {
      console.log('🫗 Clearing existing products...')
      await db.delete(products)
      console.log(' Cleared all products')
    } else {
      // Check if products already exist to avoid duplicates
      const existingProducts = await db.select().from(products).limit(1)

      if (existingProducts.length > 0) {
        console.log('⚠️ Products already exist in the database.')
        console.log(
          '➡️ Run with --reset flag to clear existing products and re-seed: bun run db:seed -- --reset',
        )
        process.exit(0)
      }
    }

    const insertedProducts = await db
      .insert(products)
      .values(sampleProducts)
      .returning({
        id: products.id,
      })

    const seededReviews = insertedProducts.flatMap((product, index) =>
      buildSeedReviews(product.id, index),
    )

    await db.insert(productReviews).values(seededReviews)

    for (const product of insertedProducts) {
      const reviewsForProduct = seededReviews.filter(
        (review) => review.productId === product.id,
      )
      const reviewsCount = reviewsForProduct.length
      const averageRating =
        reviewsForProduct.reduce((sum, review) => sum + review.rating, 0) /
        reviewsCount

      await db
        .update(products)
        .set({
          rate: averageRating.toFixed(2),
          reviews: reviewsCount,
        })
        .where(eq(products.id, product.id))
    }

    console.log(`📦 Inserted ${sampleProducts.length} products`)
    console.log(`🗣️ Inserted ${seededReviews.length} product reviews`)
    console.log(`✅ Products inserted into the database successfully!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to seed products', error)
    process.exit(1)
  }
}

const isRunningAsScript =
  process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('tsx')

if (isRunningAsScript) {
  seed()
}
