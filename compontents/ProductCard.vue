<template>
  <div class="product-card">
    <NuxtLink :to="`/product/${product.id}`" class="product-link">
      <div class="product-image">
        <img :src="product.small_image" :alt="product.name" />
      </div>
      <div class="product-name">{{ product.name }}</div>
      <div class="product-price">${{ product.price }}</div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "../server/utils/types";

defineProps<{
  product: Product;
}>();
</script>

<style scoped>
.product-card {
  text-align: center;
}

.product-link {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.3s;
}

.product-link:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  margin-bottom: 15px;
}

.product-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  transition: filter 0.3s;
}

.product-link:hover .product-image img {
  filter: brightness(0.95);
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  padding: 10px 15px;
  border-radius: 25px;
  background: #f5f5f5;
  margin-bottom: 10px;
  display: inline-block;
  width: 100%;
}

.product-price {
  font-size: 20px;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 25px;
  background: #e0e0e0;
  color: #000;
  display: inline-block;
  width: 100%;
}

@media (max-width: 768px) {
  .product-image img {
    height: 200px;
  }
}
</style>
