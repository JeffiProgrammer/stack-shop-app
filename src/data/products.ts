import { db } from '@/db'
import { products } from '@/db/schema'
import { eq } from 'drizzle-orm'


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
