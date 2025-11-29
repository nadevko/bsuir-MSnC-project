import db from "../../utils/db";

export default defineEventHandler((event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid product ID",
      });
    }

    const product = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(Number(id)) as any;

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: "Product not found",
      });
    }

    return {
      ...product,
      availability: product.amount > product.ordered_amount,
      sizes:
        typeof product.sizes === "string"
          ? JSON.parse(product.sizes)
          : product.sizes,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    console.error("Error fetching product:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch product",
    });
  }
});
