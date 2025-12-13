import db from "../utils/db";
import type { Product } from "../utils/types";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const searchTerm = ((query.q as string) || "").toLowerCase().trim();

  let sql = "SELECT * FROM products";
  const params: any[] = [];

  if (searchTerm) {
    sql += " WHERE LOWER(name) LIKE ?";
    params.push(`%${searchTerm}%`);
  }

  sql += " ORDER BY id ASC";

  const products = (await db.prepare(sql).all(...params)) as Product[];

  return products.map((product) => ({
    ...product,
    sizes: JSON.parse(product.sizes),
    availability: product.amount > product.ordered_amount,
  }));
});
