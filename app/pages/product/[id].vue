<template>
  <main class="max-w-6xl mx-auto px-4 py-12">
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="text-gray-500">Loading product…</div>
    </div>

    <div v-else-if="!product" class="text-center py-20">
      <h2 class="text-2xl font-semibold">Product not found</h2>
      <NuxtLink to="/catalog" class="mt-4 inline-block text-blue-600 hover:underline">Back to catalog</NuxtLink>
    </div>

    <div v-else class="grid md:grid-cols-2 gap-10 items-start">
      <!-- LEFT: Image -->
      <div class="space-y-4">
        <div class="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
          <img
            :src="product.full_image || '/assets/placeholder.png'"
            :alt="product.name"
            class="w-full h-[420px] md:h-[520px] object-contain bg-white"
            loading="lazy"
          />
        </div>

        <div v-if="product.small_image" class="flex gap-3">
          <img
            :src="product.small_image"
            alt="thumbnail"
            class="w-20 h-20 object-cover rounded-md border"
            loading="lazy"
          />
        </div>
      </div>

      <!-- RIGHT: Info, sizes, qty, actions -->
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900">{{ product.name }}</h1>
          <div class="mt-2 flex items-center gap-3">
            <span :class="product.availability ? 'text-green-600' : 'text-red-500'" class="font-medium">
              {{ product.availability ? 'In stock' : 'Out of stock' }}
            </span>
            <span class="text-sm text-gray-500">• {{ product.amount }} available</span>
          </div>
        </div>

        <div class="flex items-end justify-between gap-4">
          <div class="text-3xl font-extrabold text-gray-900">${{ product.price }}</div>
          <div class="text-sm text-gray-500">VAT incl.</div>
        </div>

        <!-- Sizes -->
        <div>
          <div class="mb-2 font-medium">Size</div>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="size in parsedSizes"
              :key="size"
              :disabled="!isSizeAvailable(size) || !product.availability"
              @click="selectSize(size)"
              :aria-pressed="selectedSize === size"
              :title="isSizeAvailable(size) ? `Select size ${size}` : `Size ${size} not available`"
              class="relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition transform
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                     disabled:opacity-40 disabled:cursor-not-allowed"
              :class="selectedSize === size
                ? 'bg-black text-white shadow-lg scale-105'
                : 'bg-white text-gray-800 border border-gray-200 hover:scale-105'"
            >
              {{ size }}
              <span
                class="absolute -top-1 -right-1 w-3 h-3 rounded-full ring-1 ring-white"
                :class="isSizeAvailable(size) ? 'bg-green-500' : 'bg-gray-400'"
                aria-hidden="true"
              />
            </button>
          </div>
          <p v-if="parsedSizes.length === 0" class="text-sm text-red-500 mt-2">No sizes available for this product.</p>
        </div>

        <!-- Quantity -->
        <div class="flex items-center gap-4">
          <div class="font-medium">Quantity</div>
          <div class="flex items-center border rounded-lg overflow-hidden">
            <button
              @click="decreaseQty"
              :disabled="quantity <= 1"
              class="px-3 py-2 bg-white hover:bg-gray-100 disabled:opacity-50"
              aria-label="Decrease quantity"
            >−</button>
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              :max="product.amount"
              class="w-16 text-center px-2 py-2 outline-none"
            />
            <button
              @click="increaseQty"
              :disabled="quantity >= product.amount"
              class="px-3 py-2 bg-white hover:bg-gray-100 disabled:opacity-50"
              aria-label="Increase quantity"
            >+</button>
          </div>
          <div class="ml-3 text-sm text-gray-500">Available: {{ product.amount }}</div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="handleAddToCart"
            :disabled="!canOrder || adding"
            class="flex-1 px-4 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 disabled:opacity-50 transition"
          >
            {{ adding ? 'Adding…' : 'Add to cart' }}
          </button>

          <!-- <button
            @click="handleBuyNow"
            :disabled="!canOrder || buying"
            class="flex-1 px-4 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 disabled:opacity-50 transition"
          >
            {{ buying ? 'Processing…' : 'Buy now' }}
          </button> -->
        </div>

        <div v-if="statusMessage" :class="['px-4 py-3 rounded-md text-sm', statusType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']">
          {{ statusMessage }}
        </div>

        <div class="text-sm text-gray-600">
          <p><span class="font-medium">SKU:</span> #{{ product.id }}</p>
          <p class="mt-1">Ships within 1–3 business days.</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~~/stores/auth'
import { useCsrfToken } from '~~/composables/useCsrfToken'
import type { Product } from '~~/server/utils/types'

const route = useRoute()
const auth = useAuthStore()
const { getHeader } = useCsrfToken()
const user = computed(() => auth.user)

const productId = route.params.id as string

const isLoading = ref(true)
const product = ref<Product | null>(null)
const selectedSize = ref<number | null>(null)
const quantity = ref<number>(1)

const statusMessage = ref<string | null>(null)
const statusType = ref<'success' | 'error' | null>(null)
let statusTimer: ReturnType<typeof setTimeout> | null = null

const adding = ref(false)
const buying = ref(false)

function showStatus(msg: string, type: 'success' | 'error' = 'success') {
  statusMessage.value = msg
  statusType.value = type
  if (statusTimer) clearTimeout(statusTimer)
  statusTimer = setTimeout(() => {
    statusMessage.value = null
    statusType.value = null
  }, 4000)
}

/**
 * parsedSizes: поддерживает несколько форматов:
 * - если product.sizes — уже массив -> приводим элементы к number
 * - если product.sizes — строка JSON -> парсим
 * - иначе возвращаем []
 */
const parsedSizes = computed<number[]>(() => {
  if (!product.value) return []
  const s = product.value.sizes as any
  if (Array.isArray(s)) {
    return s.map((x: any) => Number(x)).filter((n: number) => !Number.isNaN(n))
  }
  if (typeof s === 'string') {
    try {
      const parsed = JSON.parse(s)
      if (Array.isArray(parsed)) return parsed.map((x: any) => Number(x)).filter((n: number) => !Number.isNaN(n))
    } catch { /* ignore */ }
  }
  return []
})

function isSizeAvailable(size: number) {
  // сейчас у нас нет per-size стоков, поэтому ориентируемся на общий amount
  return (product.value?.amount ?? 0) > 0
}

function selectSize(size: number) {
  if (!isSizeAvailable(size)) return
  selectedSize.value = size
}

function increaseQty() {
  if (!product.value) return
  if (quantity.value < product.value.amount) quantity.value++
}

function decreaseQty() {
  if (quantity.value > 1) quantity.value--
}

async function fetchProduct() {
  isLoading.value = true
  try {
    const data = await $fetch<Product>(`/api/products/${productId}`, { credentials: 'include' })
    product.value = { ...data, availability: data.amount > data.ordered_amount }
    // безопасное присваивание: first size или null
    selectedSize.value = (parsedSizes.value.length ? (parsedSizes.value[0] ?? null) : null)
    if (product.value && product.value.amount > 0) {
      quantity.value = Math.min(quantity.value, product.value.amount)
    }
  } catch (err) {
    console.error('Failed to load product', err)
    product.value = null
  } finally {
    isLoading.value = false
  }
}

const canOrder = computed(() => {
  return !!user.value && !!product.value && product.value.availability && selectedSize.value !== null && quantity.value >= 1 && quantity.value <= (product.value?.amount ?? 0)
})

async function handleAddToCart() {
  if (!canOrder.value) {
    showStatus('Please select size and quantity', 'error')
    return
  }
  adding.value = true
  try {
    await $fetch('/api/cart', {
      method: 'POST',
      body: { product_id: product.value!.id, size: selectedSize.value, amount: quantity.value },
      headers: getHeader(),
      credentials: 'include',
    })
    showStatus('Added to cart', 'success')
  } catch (err: any) {
    console.error(err)
    showStatus(err?.data?.message || 'Failed to add to cart', 'error')
  } finally {
    adding.value = false
  }
}

async function handleBuyNow() {
  if (!canOrder.value) {
    showStatus('Please select size and quantity', 'error')
    return
  }
  buying.value = true
  try {
    // clear cart (must include CSRF header)
    await $fetch('/api/cart/clear', { method: 'POST', headers: getHeader(), credentials: 'include' })
    // add this item
    await $fetch('/api/cart', {
      method: 'POST',
      body: { product_id: product.value!.id, size: selectedSize.value, amount: quantity.value },
      headers: getHeader(),
      credentials: 'include',
    })
    navigateTo('/cart')
  } catch (err: any) {
    console.error(err)
    showStatus(err?.data?.message || 'Buy now failed', 'error')
  } finally {
    buying.value = false
  }
}

onMounted(fetchProduct)
</script>

<style scoped>
button:focus { outline: none; }
</style>
