import db from "./db";

export async function initDatabase() {
  await db
    .prepare(
      `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      birthdate TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `,
    )
    .run();

  await db
    .prepare(
      `
    CREATE TABLE IF NOT EXISTS sessions (
      jti TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      expiresAt TEXT NOT NULL,
      invalidatedAt TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `,
    )
    .run();

  await db
    .prepare(
      `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      full_image TEXT NOT NULL,
      small_image TEXT NOT NULL,
      name TEXT NOT NULL,
      ordered_amount INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL,
      sizes TEXT NOT NULL,
      amount INTEGER NOT NULL
    )
  `,
    )
    .run();

  await db
    .prepare(
      `
    CREATE TABLE IF NOT EXISTS carts (
      user_id TEXT NOT NULL,
      product_id INTEGER NOT NULL,
      size INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      PRIMARY KEY (user_id, product_id, size),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `,
    )
    .run();

  await db
    .prepare(`CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id)`)
    .run();

  await db
    .prepare(
      `CREATE INDEX IF NOT EXISTS idx_carts_product_id ON carts(product_id)`,
    )
    .run();

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
  ];

  const checkProduct = db.prepare("SELECT id FROM products WHERE id = ?");

  const insertProduct = db.prepare(`
    INSERT INTO products (id, full_image, small_image, name, price, sizes, amount)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of products) {
    const exists = await checkProduct.get(p.id);
    if (!exists) {
      await insertProduct.run(
        p.id,
        p.full_image,
        p.small_image,
        p.name,
        p.price,
        p.sizes,
        p.amount,
      );
    }
  }
}
