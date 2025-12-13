<template>
  <main class="max-w-7xl mx-auto px-4 py-12">
    <!-- Sort Menu -->
    <div class="flex flex-wrap items-center justify-between mb-8 gap-4">
      <div class="flex items-center gap-2">
        <label class="text-gray-700 font-medium">Sort by:</label>
        <select
          v-model="sortBy"
          class="border rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="amount">Amount</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-gray-700 font-medium">Order:</label>
        <select
          v-model="sortOrder"
          class="border rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <!-- Product Grid -->
    <div v-if="isLoading" class="text-center text-gray-400 py-20">
      Loading products…
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="product in sortedProducts"
        :key="product.id"
        class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
      >
        <NuxtLink :to="`/product/${product.id}`" class="block">
          <div class="h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              :src="product.small_image"
              :alt="product.name"
              class="object-cover h-full w-full transform hover:scale-105 transition"
            />
          </div>
          <div class="p-4 flex flex-col flex-grow">
            <h3 class="font-semibold text-gray-900 mb-2 truncate">{{ product.name }}</h3>
            <p class="text-gray-600 mb-4">${{ product.price }}</p>
            <p
              class="mt-auto text-sm font-medium"
              :class="product.availability ? 'text-green-600' : 'text-red-500'"
            >
              {{ product.availability ? 'In stock' : 'Out of stock' }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const { data: products, pending: isLoading } = useFetch(() => {
  const query = route.query.q ? `?q=${route.query.q}` : "";
  return `/api/products${query}`;
});

const sortBy = ref("name"); // name / price / amount
const sortOrder = ref("asc"); // asc / desc

const allProducts = computed(() => Array.isArray(products.value) ? products.value : []);

const sortedProducts = computed(() => {
  return [...allProducts.value].sort((a, b) => {
    let valA: string | number;
    let valB: string | number;

    switch (sortBy.value) {
      case "name":
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
        break;
      case "price":
        valA = a.price;
        valB = b.price;
        break;
      case "amount":
        valA = a.amount;
        valB = b.amount;
        break;
      default:
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
    }

    if (valA < valB) return sortOrder.value === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});
</script>
