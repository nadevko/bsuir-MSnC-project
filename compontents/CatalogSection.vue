<template>
    <section>
      <h2 class="text-2xl font-semibold mb-8 tracking-tight">
        {{ title }}
      </h2>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/product/${product.id}`"
          class="group"
        >
          <div
            class="rounded-xl overflow-hidden bg-white transition
                   hover:-translate-y-1 hover:shadow-xl"
          >
            <img
              :src="product.small_image"
              :alt="product.name"
              class="h-[300px] w-full object-cover"
            />
  
            <div class="p-4 space-y-1">
              <div class="text-sm font-medium text-gray-900">
                {{ product.name }}
              </div>
              <div class="text-sm text-gray-500">
                ${{ product.price }}
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string
    products: any[]
  }>()
  </script>
  