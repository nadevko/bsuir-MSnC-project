<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <main class="max-w-7xl mx-auto px-4 py-12">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">My Cart</h1>
        <NuxtLink
          to="/catalog"
          class="text-blue-600 font-semibold hover:underline dark:text-blue-400"
        >
          Continue Shopping
        </NuxtLink>
      </div>

      <!-- Loading -->
      <div v-if="isLoadingCart" class="text-center py-20 text-gray-500 dark:text-gray-400">
        Loading cart...
      </div>

      <!-- Empty State -->
      <div
        v-else-if="cartItems.length === 0"
        class="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-md"
      >
        <p class="text-gray-600 dark:text-gray-300 mb-4">Your cart is empty</p>
        <NuxtLink
          to="/catalog"
          class="px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition"
        >
          Go to Catalog
        </NuxtLink>
      </div>

      <!-- Cart Items -->
      <div v-else class="space-y-6">
        <div
          v-for="item in cartItems"
          :key="`${item.product_id}-${item.size}`"
          class="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 md:p-6 gap-4 md:gap-6 transition-transform hover:-translate-y-1 hover:shadow-lg"
        >
          <img
            :src="item.small_image"
            :alt="item.name"
            class="w-28 h-28 md:w-36 md:h-36 rounded-lg object-cover"
          />
          <div class="flex-1 flex flex-col justify-between w-full">
            <div>
              <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ item.name }}</h3>
              <p class="text-gray-500 dark:text-gray-400 mt-1">Size: {{ item.size }}</p>
            </div>
            <p class="font-semibold text-gray-900 dark:text-white mt-2 md:mt-0">${{ item.price }}</p>
          </div>
          <div class="flex flex-col items-center gap-2">
            <button
              class="text-red-500 text-xl hover:text-red-600"
              @click="removeFromCart(item.product_id, item.size)"
              :disabled="removing === keyFor(item)"
              :aria-busy="removing === keyFor(item)"
              title="Remove item"
            >
              ×
            </button>
            <div class="flex items-center gap-2 mt-2">
              <button
                class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="decreaseQty(item.product_id, item.size)"
                :disabled="updating === keyFor(item) || removing === keyFor(item)"
                title="Decrease quantity"
              >
                -
              </button>
              <span class="font-semibold w-6 text-center">{{ item.amount }}</span>
              <button
                class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="increaseQty(item.product_id, item.size)"
                :disabled="updating === keyFor(item) || removing === keyFor(item)"
                title="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <!-- Checkout Message -->
        <div v-if="checkoutMessage" :class="['p-4 rounded-lg text-center font-semibold', messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
          {{ checkoutMessage }}
        </div>

        <!-- Checkout Section -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <div class="flex flex-col gap-2 w-full md:w-auto">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Subtotal</span>
              <span class="font-semibold text-gray-900 dark:text-white">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Shipping</span>
              <span class="font-semibold text-gray-900 dark:text-white">$15.00</span>
            </div>
            <div class="flex justify-between mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
              <span class="font-bold text-lg text-gray-900 dark:text-white">Total</span>
              <span class="font-bold text-lg text-gray-900 dark:text-white">${{ (subtotal + 15).toFixed(2) }}</span>
            </div>
          </div>

          <button
            @click="checkout"
            class="mt-4 md:mt-0 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition"
            :disabled="checkouting"
          >
            {{ checkouting ? 'Processing...' : 'Proceed to Checkout' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { CartItem } from "~~/types/client";
import { useCsrfToken } from "~~/composables/useCsrfToken";

const checkoutMessage = ref<string | null>(null);
const messageType = ref<"success" | "error" | null>(null);

const { data: cartData, pending: isLoadingCart, refresh: refreshCart } = useFetch<CartItem[]>("/api/cart", { immediate: true, key: "cart-page" });

// reactive helpers to track which item is updating/removing
const updating = ref<string | null>(null);
const removing = ref<string | null>(null);
const checkouting = ref(false);

const cartItems = computed(() => cartData.value || []);

const subtotal = computed(() => cartItems.value.reduce((sum, item) => sum + (item.price ?? 0) * item.amount, 0));

function showMessage(message: string, type: "success" | "error") {
  checkoutMessage.value = message;
  messageType.value = type;
  setTimeout(() => {
    checkoutMessage.value = null;
    messageType.value = null;
  }, 5000);
}

function keyFor(item: CartItem) {
  return `${item.product_id}-${item.size}`;
}

const { getHeader } = useCsrfToken();

async function increaseQty(productId: number, size: number) {
  const item = cartItems.value.find((i) => i.product_id === productId && i.size === size);
  if (!item) return;
  const key = `${productId}-${size}`;
  updating.value = key;
  try {
    await $fetch("/api/cart", {
      method: "PATCH",
      body: { product_id: productId, size, amount: item.amount + 1 },
      headers: getHeader(),
      credentials: 'include'
    });
    await refreshCart();
  } catch (err: any) {
    console.error("Failed to increase qty:", err);
    showMessage(err?.data?.message || "Failed to update quantity", "error");
  } finally {
    updating.value = null;
  }
}

async function decreaseQty(productId: number, size: number) {
  const item = cartItems.value.find((i) => i.product_id === productId && i.size === size);
  if (!item) return;
  const key = `${productId}-${size}`;

  // if amount > 1 -> PATCH, if amount === 1 -> DELETE
  if (item.amount > 1) {
    updating.value = key;
    try {
      await $fetch("/api/cart", {
        method: "PATCH",
        body: { product_id: productId, size, amount: item.amount - 1 },
        headers: getHeader(),
        credentials: 'include'
      });
      await refreshCart();
    } catch (err: any) {
      console.error("Failed to decrease qty:", err);
      showMessage(err?.data?.message || "Failed to update quantity", "error");
    } finally {
      updating.value = null;
    }
  } else {
    // amount === 1 -> remove item
    removing.value = key;
    try {
      await $fetch("/api/cart", {
        method: "DELETE",
        body: { product_id: productId, size },
        headers: getHeader(),
        credentials: 'include'
      });
      await refreshCart();
    } catch (err: any) {
      console.error("Failed to remove item:", err);
      showMessage(err?.data?.message || "Failed to remove item", "error");
    } finally {
      removing.value = null;
    }
  }
}

async function removeFromCart(productId: number, size: number) {
  const key = `${productId}-${size}`;
  removing.value = key;
  try {
    await $fetch("/api/cart", {
      method: "DELETE",
      body: { product_id: productId, size },
      headers: getHeader(),
      credentials: 'include'
    });
    await refreshCart();
  } catch (err: any) {
    console.error("Failed to remove from cart:", err);
    showMessage(err?.data?.message || "Failed to remove item", "error");
  } finally {
    removing.value = null;
  }
}

async function checkout() {
  checkouting.value = true;
  try {
    await $fetch("/api/checkout", { method: "POST", headers: getHeader(), credentials: 'include' });
    await refreshCart();
    showMessage("Order completed! Your cart has been cleared.", "success");
  } catch (err: any) {
    console.error("Checkout failed:", err);
    showMessage(err?.data?.message || "Checkout failed. Please try again.", "error");
  } finally {
    checkouting.value = false;
  }
}
</script>
