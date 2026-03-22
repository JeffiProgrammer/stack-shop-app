import {
  check,
  index,
  pgTable,
  integer,
  numeric,
  pgEnum,
  timestamp,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

const badgeValues = ['New', 'Sale', 'Exclusive', 'Limited', 'Best Seller'] as const
const inventoryValues = ['in-stock', 'out-of-stock', 'pre-order', 'back-order'] as const

export const badgeEnum = pgEnum('badge', badgeValues)
export const inventoryEnum = pgEnum('inventory', inventoryValues)

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  badge: badgeEnum('badge'),
  rate: numeric('rate', { precision: 3, scale: 2 }),
  reviews: integer('reviews'),
  image: varchar('image', { length: 512 }),
  inventory: inventoryEnum('inventory').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type ProductSelect = typeof products.$inferSelect
export type ProductInsert = typeof products.$inferInsert

export const productReviews = pgTable(
  'product_reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    reviewerName: varchar('reviewer_name', { length: 128 }).notNull(),
    rating: integer('rating').notNull(),
    comment: text('comment').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('product_reviews_product_id_idx').on(table.productId),
    check('product_reviews_rating_check', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  ],
)

export type ProductReviewSelect = typeof productReviews.$inferSelect
export type ProductReviewInsert = typeof productReviews.$inferInsert

// Cart items table
export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type CartItemSelect = typeof cartItems.$inferSelect
export type CartItemInsert = typeof cartItems.$inferInsert

// Export enum value types inferred the enum definitions
export type BadgeValue = (typeof badgeValues)[number]
export type InventoryValue = (typeof inventoryValues)[number]
