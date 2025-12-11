import Database from "better-sqlite3";
import { join } from "path";
import type { User, Session } from "./types";

const db = new Database(join(process.cwd(), "data.sqlite"));

db.pragma("journal_mode = WAL");

db.prepare(
  ` CREATE TABLE IF NOT EXISTS users (
   id TEXT PRIMARY KEY,
   username TEXT NOT NULL,
   email TEXT UNIQUE NOT NULL,
   passwordHash TEXT NOT NULL,
   birthdate TEXT NOT NULL,
   createdAt TEXT NOT NULL
) `,
).run();

db.prepare(
  ` CREATE TABLE IF NOT EXISTS sessions (
   jti TEXT PRIMARY KEY,
   userId TEXT NOT NULL,
   expiresAt TEXT NOT NULL,
   invalidatedAt TEXT,
   FOREIGN KEY (userId) REFERENCES users(id)
) `,
).run();

db.prepare(
  ` CREATE TABLE IF NOT EXISTS products (
   id INTEGER PRIMARY KEY,
   full_image TEXT NOT NULL,
   small_image TEXT NOT NULL,
   name TEXT NOT NULL,
   ordered_amount INTEGER NOT NULL DEFAULT 0,
   price REAL NOT NULL,
   sizes TEXT NOT NULL,
   amount INTEGER NOT NULL
) `,
).run();

db.prepare(
  ` CREATE TABLE IF NOT EXISTS carts (
   user_id TEXT NOT NULL,
   product_id INTEGER NOT NULL,
   size INTEGER NOT NULL,
   amount INTEGER NOT NULL,
   PRIMARY KEY (user_id, product_id, size),
   FOREIGN KEY (user_id) REFERENCES users(id),
   FOREIGN KEY (product_id) REFERENCES products(id)
) `,
).run();

db.prepare(
  `CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id)`,
).run();

db.prepare(
  `CREATE INDEX IF NOT EXISTS idx_carts_product_id ON carts(product_id)`,
).run();

// Seed products
const products = [
  {
    id: 1,
    full_image: "/assets/product/1/main.png",
    small_image: "/assets/product/1/main.png",
    name: "Nike Air Max 270",
    price: 150,
    sizes: JSON.stringify([39, 40, 41, 42, 43, 44, 45]),
    amount: 50,
  },
  {
    id: 2,
    full_image: "/assets/product/2/main.png",
    small_image: "/assets/product/2/main.png",
    name: "Adidas Ultraboost 22",
    price: 180,
    sizes: JSON.stringify([38, 39, 40, 41, 42, 43, 44, 45, 46]),
    amount: 35,
  },
  {
    id: 3,
    full_image: "/assets/product/3/main.png",
    small_image: "/assets/product/3/main.png",
    name: "New Balance 990v5",
    price: 175,
    sizes: JSON.stringify([39, 40, 41, 42, 43, 44, 45]),
    amount: 28,
  },
  {
    id: 4,
    full_image: "/assets/product/4/main.png",
    small_image: "/assets/product/4/main.png",
    name: "Nike LeBron 19",
    price: 200,
    sizes: JSON.stringify([40, 41, 42, 43, 44, 45, 46]),
    amount: 22,
  },
  {
    id: 5,
    full_image: "/assets/product/5/main.png",
    small_image: "/assets/product/5/main.png",
    name: "Jordan XXXVI",
    price: 185,
    sizes: JSON.stringify([39, 40, 41, 42, 43, 44, 45]),
    amount: 18,
  },
  {
    id: 6,
    full_image: "/assets/product/6/main.png",
    small_image: "/assets/product/6/main.png",
    name: "Under Armour Curry 9",
    price: 160,
    sizes: JSON.stringify([38, 39, 40, 41, 42, 43, 44, 45]),
    amount: 30,
  },
  {
    id: 7,
    full_image: "/assets/product/7/main.png",
    small_image: "/assets/product/7/main.png",
    name: "Adidas Stan Smith",
    price: 85,
    sizes: JSON.stringify([36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]),
    amount: 100,
  },
  {
    id: 8,
    full_image: "/assets/product/8/main.png",
    small_image: "/assets/product/8/main.png",
    name: "Nike Air Force 1",
    price: 100,
    sizes: JSON.stringify([36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]),
    amount: 120,
  },
  {
    id: 9,
    full_image: "/assets/product/9/main.png",
    small_image: "/assets/product/9/main.png",
    name: "Vans Old Skool",
    price: 60,
    sizes: JSON.stringify([36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]),
    amount: 150,
  },
];

const checkProduct = db.prepare("SELECT id FROM products WHERE id = ?");
const insertProduct = db.prepare(
  `INSERT INTO products (id, full_image, small_image, name, price, sizes, amount)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
);

for (const product of products) {
  if (!checkProduct.get(product.id)) {
    insertProduct.run(
      product.id,
      product.full_image,
      product.small_image,
      product.name,
      product.price,
      product.sizes,
      product.amount,
    );
  }
}

const globalWithCleanup = globalThis as unknown as {
  __sessionsCleanupInterval?: NodeJS.Timeout;
};

if (!globalWithCleanup.__sessionsCleanupInterval) {
  globalWithCleanup.__sessionsCleanupInterval = setInterval(() => {
    db.prepare("DELETE FROM sessions WHERE expiresAt < datetime('now')").run();
  }, 3600000);
}

export default db;
