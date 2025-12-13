import db from "../utils/db";
import type { Product } from "../utils/types";
import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const searchTerm = ((query.q as string) || "").toLowerCase().trim();

  // Разрешённые поля для сортировки
  const allowedSortFields: (keyof Product)[] = ["id", "name", "price", "amount", "ordered_amount"];
  const sortBy = allowedSortFields.includes(query.sortBy as keyof Product)
    ? (query.sortBy as keyof Product)
    : "name";

  const sortOrder = (query.sortOrder as string)?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  let sql = "SELECT * FROM products";
  const params: any[] = [];

  if (searchTerm) {
    sql += " WHERE LOWER(name) LIKE ?";
    params.push(`%${searchTerm}%`);
  }

  sql += ` ORDER BY ${sortBy} ${sortOrder}`;

  const products = (await db.prepare(sql).all(...params)) as Product[];

  return products.map((product) => ({
    ...product,
    sizes: JSON.parse(product.sizes),
    availability: product.amount > product.ordered_amount,
  }));
});
