import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const productsTable = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  sku: text('sku'),
  category: text('category').notNull().default('hookah'),
  subcategory: text('subcategory'),
  price: real('price').notNull().default(0),
  mrp: real('mrp').default(0),
  buyPrice: real('buy_price').default(0),
  discountPercent: integer('discount_percent').default(0),
  stock: integer('stock').default(0),
  isTobaccoFree: integer('is_tobacco_free').default(1), // 1 for true, 0 for false
  isAgeRestricted: integer('is_age_restricted').default(1),
  isBestseller: integer('is_bestseller').default(0),
  isFeatured: integer('is_featured').default(0),
  isOffer: integer('is_offer').default(0),
  rating: real('rating').default(5.0),
  reviewCount: integer('review_count').default(0),
  shortDescription: text('short_description'),
  description: text('description'),
  images: text('images').default('[]'), // JSON array string
  ingredients: text('ingredients').default('[]'), // JSON array string
  variants: text('variants').default('[]'), // JSON array string
  attributes: text('attributes').default('{}'), // JSON object string
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const categoriesTable = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  displayName: text('display_name').notNull(),
  image: text('image').default(''),
  iconName: text('icon_name').default('Sparkles'),
  description: text('description').default(''),
  itemCount: integer('item_count').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const ordersTable = sqliteTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull(),
  customerName: text('customer_name'),
  customerPhone: text('customer_phone'),
  customerEmail: text('customer_email'),
  shippingAddress: text('shipping_address').default('{}'),
  items: text('items').default('[]'),
  subtotal: real('subtotal').default(0),
  discount: real('discount').default(0),
  totalAmount: real('total_amount').default(0),
  paymentMethod: text('payment_method').default('cash_on_delivery'),
  paymentStatus: text('payment_status').default('pending'),
  orderStatus: text('order_status').default('order_confirmed'),
  trackingNumber: text('tracking_number'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const uploadedFilesTable = sqliteTable('uploaded_files', {
  id: text('id').primaryKey(),
  filename: text('filename').notNull(),
  folder: text('folder').notNull(),
  mimeType: text('mime_type').notNull().default('image/jpeg'),
  dataBase64: text('data_base64').notNull(),
  sizeBytes: integer('size_bytes').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type DbProduct = typeof productsTable.$inferSelect;
export type InsertProduct = typeof productsTable.$inferInsert;

export type DbCategory = typeof categoriesTable.$inferSelect;
export type InsertCategory = typeof categoriesTable.$inferInsert;

export type DbOrder = typeof ordersTable.$inferSelect;
export type InsertOrder = typeof ordersTable.$inferInsert;

export type DbUploadedFile = typeof uploadedFilesTable.$inferSelect;
export type InsertUploadedFile = typeof uploadedFilesTable.$inferInsert;
