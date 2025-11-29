import db from "../utils/db";

export default defineEventHandler((event) => {
  try {
    const products = db.prepare("SELECT * FROM products").all() as any[];

    return products.map((p) => ({
      ...p,
      availability: p.amount > p.ordered_amount,
      sizes: typeof p.sizes === "string" ? JSON.parse(p.sizes) : p.sizes,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch products",
    });
  }
});
