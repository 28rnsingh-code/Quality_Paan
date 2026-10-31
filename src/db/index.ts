import path from 'path';
import fs from 'fs';
import { createClient, Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq, and } from 'drizzle-orm';
import * as schema from './schema';
import { Product, CategoryItem } from '../types';

// 1. Determine connection mode
const rawDatabaseUrl = (process.env.DATABASE_URL || '').trim();
const isPostgres = rawDatabaseUrl.startsWith('postgres://') || rawDatabaseUrl.startsWith('postgresql://');

let client: Client;
let dbUrl: string;

if (isPostgres) {
  dbUrl = rawDatabaseUrl;
} else if (rawDatabaseUrl.startsWith('file:') || rawDatabaseUrl.startsWith('sqlite:')) {
  dbUrl = rawDatabaseUrl.replace(/^sqlite:/, 'file:');
} else {
  // Default: local SQLite database file inside project directory `./data/store.db`
  const dataDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try { fs.mkdirSync(dataDir, { recursive: true }); } catch {}
  }
  const dbFilePath = path.resolve(dataDir, 'store.db');
  dbUrl = `file:${dbFilePath}`;
}

// 2. Initialize LibSQL client for SQLite local database
client = createClient({
  url: dbUrl,
});

export const db = drizzle(client, { schema });
export { schema, isPostgres, dbUrl, client };

// 3. Auto-bootstrap SQLite tables on initialization if they don't exist
export async function initializeDatabase() {
  try {
    // Create products table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sku TEXT,
        category TEXT NOT NULL DEFAULT 'hookah',
        subcategory TEXT,
        price REAL NOT NULL DEFAULT 0,
        mrp REAL DEFAULT 0,
        buy_price REAL DEFAULT 0,
        discount_percent INTEGER DEFAULT 0,
        stock INTEGER DEFAULT 0,
        is_tobacco_free INTEGER DEFAULT 1,
        is_age_restricted INTEGER DEFAULT 1,
        is_bestseller INTEGER DEFAULT 0,
        is_featured INTEGER DEFAULT 0,
        is_offer INTEGER DEFAULT 0,
        rating REAL DEFAULT 5.0,
        review_count INTEGER DEFAULT 0,
        short_description TEXT,
        description TEXT,
        images TEXT DEFAULT '[]',
        ingredients TEXT DEFAULT '[]',
        variants TEXT DEFAULT '[]',
        attributes TEXT DEFAULT '{}',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Create categories table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        display_name TEXT NOT NULL,
        image TEXT DEFAULT '',
        icon_name TEXT DEFAULT 'Sparkles',
        description TEXT DEFAULT '',
        item_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Create orders table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_number TEXT NOT NULL,
        customer_name TEXT,
        customer_phone TEXT,
        customer_email TEXT,
        shipping_address TEXT DEFAULT '{}',
        items TEXT DEFAULT '[]',
        subtotal REAL DEFAULT 0,
        discount REAL DEFAULT 0,
        total_amount REAL DEFAULT 0,
        payment_method TEXT DEFAULT 'cash_on_delivery',
        payment_status TEXT DEFAULT 'pending',
        order_status TEXT DEFAULT 'order_confirmed',
        tracking_number TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Create uploaded_files table for permanent media persistence
    await client.execute(`
      CREATE TABLE IF NOT EXISTS uploaded_files (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        folder TEXT NOT NULL,
        mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
        data_base64 TEXT NOT NULL,
        size_bytes INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    console.log(`[Drizzle ORM] SQLite database initialized successfully at: ${dbUrl}`);
    return { success: true, mode: isPostgres ? 'postgresql' : 'sqlite', url: dbUrl };
  } catch (err) {
    console.error('[Drizzle ORM] Error initializing database tables:', err);
    throw err;
  }
}

// 4. Products CRUD operations with Drizzle ORM
export async function getAllProducts(): Promise<Product[]> {
  try {
    const rows = await db.select().from(schema.productsTable);
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      sku: r.sku || '',
      category: r.category as any,
      subcategory: r.subcategory || undefined,
      price: r.price,
      mrp: r.mrp ?? r.price,
      buyPrice: r.buyPrice ?? undefined,
      discountPercent: r.discountPercent ?? 0,
      stock: r.stock ?? 0,
      isTobaccoFree: r.isTobaccoFree === 1,
      isAgeRestricted: r.isAgeRestricted === 1,
      isBestseller: r.isBestseller === 1,
      isFeatured: r.isFeatured === 1,
      isOffer: r.isOffer === 1,
      rating: r.rating ?? 5.0,
      reviewCount: r.reviewCount ?? 0,
      shortDescription: r.shortDescription || '',
      description: r.description || '',
      images: (() => {
        try { return JSON.parse(r.images || '[]'); } catch { return []; }
      })(),
      ingredients: (() => {
        try { return JSON.parse(r.ingredients || '[]'); } catch { return []; }
      })(),
      variants: (() => {
        try { return JSON.parse(r.variants || '[]'); } catch { return []; }
      })(),
      attributes: (() => {
        try { return JSON.parse(r.attributes || '{}'); } catch { return {}; }
      })(),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  } catch (err) {
    console.error('[Drizzle ORM] Error in getAllProducts:', err);
    return [];
  }
}

export async function saveAllProducts(products: Product[]): Promise<number> {
  try {
    await client.execute('DELETE FROM products');
    if (!products || products.length === 0) return 0;

    for (const p of products) {
      await db.insert(schema.productsTable).values({
        id: p.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: p.name || 'Untitled Product',
        sku: p.sku || '',
        category: p.category || 'hookah',
        subcategory: p.subcategory || '',
        price: Number(p.price) || 0,
        mrp: Number(p.mrp) || Number(p.price) || 0,
        buyPrice: Number(p.buyPrice) || 0,
        discountPercent: Number(p.discountPercent) || 0,
        stock: Number(p.stock) || 0,
        isTobaccoFree: p.isTobaccoFree !== false ? 1 : 0,
        isAgeRestricted: p.isAgeRestricted !== false ? 1 : 0,
        isBestseller: p.isBestseller ? 1 : 0,
        isFeatured: p.isFeatured ? 1 : 0,
        isOffer: p.isOffer ? 1 : 0,
        rating: Number(p.rating) || 5.0,
        reviewCount: Number(p.reviewCount) || 0,
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        images: JSON.stringify(p.images || []),
        ingredients: JSON.stringify(p.ingredients || []),
        variants: JSON.stringify(p.variants || []),
        attributes: JSON.stringify(p.attributes || {}),
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
      });
    }
    return products.length;
  } catch (err) {
    console.error('[Drizzle ORM] Error in saveAllProducts:', err);
    throw err;
  }
}

export async function clearAllProductsInDb(): Promise<void> {
  await client.execute('DELETE FROM products');
}

// 5. Categories CRUD operations with Drizzle ORM
export async function getAllCategories(): Promise<CategoryItem[]> {
  try {
    const rows = await db.select().from(schema.categoriesTable);
    if (!rows || rows.length === 0) return [];
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      displayName: r.displayName,
      image: r.image || '',
      iconName: r.iconName || 'Sparkles',
      description: r.description || '',
      itemCount: r.itemCount ?? 0,
    }));
  } catch (err) {
    console.error('[Drizzle ORM] Error in getAllCategories:', err);
    return [];
  }
}

export async function saveAllCategories(categories: CategoryItem[]): Promise<number> {
  try {
    await client.execute('DELETE FROM categories');
    if (!categories || categories.length === 0) return 0;
    for (const c of categories) {
      await db.insert(schema.categoriesTable).values({
        id: c.id,
        name: c.name,
        displayName: c.displayName,
        image: c.image || '',
        iconName: c.iconName || 'Sparkles',
        description: c.description || '',
        itemCount: c.itemCount ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    return categories.length;
  } catch (err) {
    console.error('[Drizzle ORM] Error in saveAllCategories:', err);
    throw err;
  }
}

// 6. Uploaded Files Operations for Permanent Media Storage
export async function saveUploadedFile(file: {
  id?: string;
  filename: string;
  folder: string;
  mimeType: string;
  dataBase64: string;
  sizeBytes?: number;
}): Promise<string> {
  const id = file.id || `${file.folder}_${file.filename}`;
  const now = new Date().toISOString();
  const sizeBytes = file.sizeBytes || Math.round((file.dataBase64.length * 3) / 4);

  try {
    await client.execute({
      sql: `INSERT INTO uploaded_files (id, filename, folder, mime_type, data_base64, size_bytes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET 
              data_base64 = excluded.data_base64,
              size_bytes = excluded.size_bytes,
              mime_type = excluded.mime_type,
              updated_at = excluded.updated_at`,
      args: [
        id,
        file.filename,
        file.folder,
        file.mimeType || 'image/jpeg',
        file.dataBase64,
        sizeBytes,
        now,
        now,
      ],
    });
    return id;
  } catch (err) {
    console.error('[Drizzle ORM] Error saving uploaded file to DB:', err);
    throw err;
  }
}

export async function getUploadedFile(folder: string, filename: string): Promise<{
  id: string;
  filename: string;
  folder: string;
  mimeType: string;
  dataBase64: string;
  sizeBytes: number;
} | null> {
  try {
    const res = await client.execute({
      sql: `SELECT * FROM uploaded_files WHERE folder = ? AND filename = ? LIMIT 1`,
      args: [folder, filename],
    });
    if (res.rows && res.rows.length > 0) {
      const r: any = res.rows[0];
      return {
        id: String(r.id),
        filename: String(r.filename),
        folder: String(r.folder),
        mimeType: String(r.mime_type || 'image/jpeg'),
        dataBase64: String(r.data_base64),
        sizeBytes: Number(r.size_bytes || 0),
      };
    }
    // Fallback: search by filename only
    const res2 = await client.execute({
      sql: `SELECT * FROM uploaded_files WHERE filename = ? LIMIT 1`,
      args: [filename],
    });
    if (res2.rows && res2.rows.length > 0) {
      const r: any = res2.rows[0];
      return {
        id: String(r.id),
        filename: String(r.filename),
        folder: String(r.folder),
        mimeType: String(r.mime_type || 'image/jpeg'),
        dataBase64: String(r.data_base64),
        sizeBytes: Number(r.size_bytes || 0),
      };
    }
    return null;
  } catch (err) {
    console.error('[Drizzle ORM] Error querying uploaded file from DB:', err);
    return null;
  }
}

// 7. Orders CRUD operations
export async function getAllOrders(): Promise<any[]> {
  try {
    const rows = await db.select().from(schema.ordersTable);
    return rows.map((r) => ({
      id: r.id,
      orderNumber: r.orderNumber,
      customerName: r.customerName || '',
      customerPhone: r.customerPhone || '',
      customerEmail: r.customerEmail || '',
      shippingAddress: (() => { try { return JSON.parse(r.shippingAddress || '{}'); } catch { return {}; } })(),
      items: (() => { try { return JSON.parse(r.items || '[]'); } catch { return []; } })(),
      subtotal: r.subtotal || 0,
      discount: r.discount || 0,
      totalAmount: r.totalAmount || 0,
      paymentMethod: r.paymentMethod || 'cod',
      paymentStatus: r.paymentStatus || 'pending',
      orderStatus: r.orderStatus || 'order_confirmed',
      trackingNumber: r.trackingNumber || '',
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  } catch (err) {
    console.error('[Drizzle ORM] Error in getAllOrders:', err);
    return [];
  }
}

export async function saveOrder(order: any): Promise<string> {
  const now = new Date().toISOString();
  const id = order.id || `ord-${Date.now()}`;
  try {
    await client.execute({
      sql: `INSERT INTO orders (id, order_number, customer_name, customer_phone, customer_email, shipping_address, items, subtotal, discount, total_amount, payment_method, payment_status, order_status, tracking_number, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              order_status = excluded.order_status,
              payment_status = excluded.payment_status,
              updated_at = excluded.updated_at`,
      args: [
        id,
        order.orderNumber || `QP-${Date.now()}`,
        order.customerName || order.shippingAddress?.fullName || 'Customer',
        order.customerPhone || order.shippingAddress?.phone || '',
        order.customerEmail || order.userId || '',
        JSON.stringify(order.shippingAddress || {}),
        JSON.stringify(order.items || []),
        Number(order.subtotal) || 0,
        Number(order.discount) || 0,
        Number(order.total || order.totalAmount) || 0,
        order.paymentMethod || 'cod',
        order.paymentStatus || 'pending',
        order.status || order.orderStatus || 'order_confirmed',
        order.trackingNumber || '',
        order.createdAt || now,
        now,
      ],
    });
    return id;
  } catch (err) {
    console.error('[Drizzle ORM] Error saving order to DB:', err);
    throw err;
  }
}
