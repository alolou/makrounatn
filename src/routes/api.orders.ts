import { createFileRoute } from '@tanstack/react-router'
import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { customers, orders } from '../../db/schema.js'
import products from '@/data/products'

const orderSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(20),
  address: z.string().trim().min(5).max(250),
  city: z.string().trim().min(2).max(80),
  notes: z.string().trim().max(500).optional().default(''),
  botField: z.string().max(0).optional().default(''),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(20),
})

export const Route = createFileRoute('/api/orders')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const parsed = orderSchema.safeParse(await request.json())

          if (!parsed.success || parsed.data.botField) {
            return Response.json(
              { error: 'Vérifiez les informations de votre commande.' },
              { status: 400 },
            )
          }

          const phone = parsed.data.phone.replace(/[^0-9+]/g, '')
          const phoneDigits = phone.replace(/\D/g, '')
          if (phoneDigits.length < 8 || phoneDigits.length > 15) {
            return Response.json(
              { error: 'Entrez un numéro de téléphone valide.' },
              { status: 400 },
            )
          }

          const items = parsed.data.items.map((requestedItem) => {
            const product = products.find(
              (entry) => entry.id === requestedItem.productId,
            )

            if (!product) {
              throw new Error('Produit inconnu')
            }

            return {
              productId: product.id,
              name: product.name,
              quantity: requestedItem.quantity,
              unitPrice: product.price,
            }
          })
          const subtotal = items.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice,
            0,
          )

          const result = await db.transaction(async (transaction) => {
            const [customer] = await transaction
              .insert(customers)
              .values({
                name: parsed.data.name,
                phone,
                orderCount: 1,
              })
              .onConflictDoUpdate({
                target: customers.phone,
                set: {
                  name: parsed.data.name,
                  orderCount: sql`${customers.orderCount} + 1`,
                  updatedAt: new Date(),
                },
              })
              .returning()

            if (!customer) {
              throw new Error('Impossible de créer le client')
            }

            const loyaltyReward = customer.orderCount % 10 === 0
            const [order] = await transaction
              .insert(orders)
              .values({
                customerId: customer.id,
                customerName: parsed.data.name,
                phone,
                address: parsed.data.address,
                city: parsed.data.city,
                notes: parsed.data.notes,
                items,
                subtotal,
                loyaltyReward,
              })
              .returning({ id: orders.id })

            if (!order) {
              throw new Error('Impossible de créer la commande')
            }

            return {
              orderId: order.id,
              orderCount: customer.orderCount,
              loyaltyReward,
              nextRewardIn: loyaltyReward ? 10 : 10 - (customer.orderCount % 10),
              subtotal,
            }
          })

          return Response.json(result, { status: 201 })
        } catch (error) {
          console.error('Order creation failed', error)
          return Response.json(
            { error: "La commande n'a pas pu être enregistrée. Réessayez." },
            { status: 500 },
          )
        }
      },
    },
  },
})
