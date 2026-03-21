import dotenv from 'dotenv'
import type { ProductInsert } from './schema'

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
    rate: '4.5',
    reviews: 100,
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 2',
    description: 'Description for Product 2',
    price: '29.99',
    badge: 'Sale',
    rate: '4.0',
    reviews: 50,
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 3',
    description: 'Description for Product 3',
    price: '39.99',
    badge: 'Limited',
    rate: '3.5',
    reviews: 20,
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'out-of-stock',
  },
  {
    name: 'Product 4',
    description: 'Description for Product 4',
    price: '49.99',
    badge: 'Exclusive',
    rate: '5.0',
    reviews: 200,
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 5',
    description: 'Description for Product 5',
    price: '59.99',
    badge: 'Best Seller',
    rate: '4.8',
    reviews: 150,
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 6',
    description: 'Description for Product 6',
    price: '69.99',
    rate: '4.3',
    reviews: 80,
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 7',
    description: 'Description for Product 7',
    price: '79.99',
    badge: 'Sale',
    rate: '4.1',
    reviews: 60,
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 8 ',
    description: 'Description for Product 8',
    price: '89.99',
    badge: 'Limited',
    rate: '3.9',
    reviews: 30,
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'out-of-stock',
  },
  {
    name: 'Product 9',
    description: 'Description for Product 9',
    price: '99.99',
    badge: 'Exclusive',
    rate: '4.7',
    reviews: 120,
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 10',
    description: 'Description for Product 10',
    price: '109.99',
    badge: 'Best Seller',
    rate: '4.9',
    reviews: 180,
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'in-stock',
  },
  {
    name: 'Product 11',
    description: 'Description for Product 11',
    price: '119.99',
    badge: 'New',
    rate: '4.4',
    reviews: 90,
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'pre-order',
  },
  {
    name: 'Product 12',
    description: 'Description for Product 12',
    price: '129.99',
    badge: 'Sale',
    rate: '4.2',
    reviews: 70,
    image: 'https://picsum.photos/seed/picsum/500/300',
    inventory: 'back-order',
  },
]

async function seed() {
  try {
    // Dynamically import database modules after environment variables are loaded
    const { db } = await import('./index')
    const { products } = await import('./schema')

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

    await db.insert(products).values(sampleProducts)

    console.log(`📦 Inserted ${sampleProducts.length} products`)
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
