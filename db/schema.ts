import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const customers = pgTable('customers', {
  id: serial().primaryKey(),
  name: text().notNull(),
  phone: text().notNull().unique(),
  orderCount: integer('order_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type OrderItem = {
  productId: string
  name: string
  quantity: number
  unitPrice: number
}

export const orders = pgTable('orders', {
  id: uuid().defaultRandom().primaryKey(),
  customerId: integer('customer_id')
    .notNull()
    .references(() => customers.id),
  customerName: text('customer_name').notNull(),
  phone: text().notNull(),
  address: text().notNull(),
  city: text().notNull(),
  notes: text().notNull().default(''),
  items: jsonb().$type<OrderItem[]>().notNull(),
  subtotal: integer().notNull(),
  status: text().notNull().default('nouvelle'),
  loyaltyReward: boolean('loyalty_reward').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
