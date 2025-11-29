<template>
  <div>
    <!-- HEADER -->
    <header class="header">
      <div class="header-left">
        <button class="burger" aria-label="menu">☰</button>
      </div>

      <!-- Centered logo -->
      <div class="logo-center">
        <NuxtLink to="/" class="logo-link">
          <img
            src="/assets/logo.png"
            alt="Ezzy Step"
            class="logo logo-desktop"
          />
          <img
            src="/assets/logo.png"
            alt="Ezzy Step"
            class="logo logo-mobile"
          />
        </NuxtLink>
      </div>

      <!-- Desktop right: search + join + log in (visible on desktop) -->
      <div class="header-right">
        <div class="search-wrap">
          <input type="text" class="search-input" placeholder="Search" />
        </div>
        <NuxtLink v-if="!user" to="/register" class="btn join"
          >JOIN NOW</NuxtLink
        >
        <NuxtLink v-if="!user" to="/login" class="btn outline">LOG IN</NuxtLink>
        <NuxtLink v-if="user" to="/profile" class="btn outline"
          >PROFILE</NuxtLink
        >
      </div>

      <!-- Mobile icons (hidden on desktop, visible on mobile) -->
      <div class="mobile-icons" aria-hidden="true">
        <button class="icon-btn" aria-label="notifications">
          <img src="/assets/bell.png" alt="" />
        </button>
        <button class="icon-btn" aria-label="search">
          <img src="/assets/search.png" alt="" />
        </button>
      </div>
    </header>

    <!-- Model Content -->
    <main>
      <div class="model-container">
        <!-- Top Left - Product Image with Brand -->
        <div class="model-image">
          <img
            :src="`/assets/product/${productId}/main.png`"
            :alt="product.name"
          />
        </div>

        <!-- Top Right - Product Info -->
        <div class="model-info">
          <h1 class="model-name">{{ product.name }}</h1>
          <div
            :class="['model-available', { unavailable: !product.availability }]"
          >
            {{ product.availability ? "Model is available" : "Out of stock" }}
          </div>
          <div class="model-price">${{ product.price }}</div>

          <div class="size-selection">
            <div class="size-title">Select Size</div>
            <div class="size-options">
              <div
                v-for="size in sizes"
                :key="size"
                :class="['size-option', { selected: selectedSize === size }]"
                @click="selectedSize = size"
              >
                {{ size }}
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <button class="add-to-cart" @click="addToCart">ADD TO CART</button>
            <button class="back-button" @click="goBack">←</button>
          </div>
        </div>

        <!-- Bottom Left - Buy Now Section -->
        <div class="buy-now">
          <div class="buy-now-title">BUY NOW</div>
          <div class="buy-now-content">
            <div class="order-section">
              <img src="/assets/truck.png" alt="Delivery" class="truck-icon" />
              <button class="order-button" @click="orderNow">ORDER</button>
              <div class="pickup-options">
                <div class="pickup-option">
                  <input
                    v-model="deliveryMethod"
                    type="radio"
                    id="pickup1"
                    value="store"
                    name="pickup"
                  />
                  <label for="pickup1">Pick up from store</label>
                </div>
                <div class="pickup-option">
                  <input
                    v-model="deliveryMethod"
                    type="radio"
                    id="pickup2"
                    value="home"
                    name="pickup"
                  />
                  <label for="pickup2">Home delivery</label>
                </div>
              </div>
            </div>
            <div class="map-section">
              <img src="/assets/map.png" alt="Store Location" />
            </div>
          </div>
        </div>

        <!-- Bottom Right - Empty -->
        <div class="empty-section">
          <!-- This section is intentionally left empty -->
        </div>
      </div>

      <!-- Bottom Frame -->
      <div class="bottom-frame">
        <img src="/assets/lowframe.png" alt="Bottom Frame" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "~~/composables/useAuth";
import type { Product } from "~~/server/utils/types";

const route = useRoute();
const auth = useAuth();
const user = computed(() => auth.user.value);

const productId = computed(() => route.params.id as string);
const selectedSize = ref(42);
const deliveryMethod = ref("store");

const { data: productData } = await useFetch(
  () => `/api/products/${productId.value}`,
);
const product = computed(
  () =>
    (productData.value as any) || {
      name: "",
      price: 0,
      sizes: [],
      availability: false,
    },
);

const sizes = computed(
  () => product.value.sizes || [39, 40, 41, 42, 43, 44, 45],
);

function addToCart() {
  alert(`Added ${product.value.name} (Size ${selectedSize.value}) to cart!`);
}

function orderNow() {
  alert(
    `Ordering ${product.value.name} via ${deliveryMethod.value === "store" ? "store pickup" : "home delivery"}`,
  );
}

function goBack() {
  window.history.back();
}

onMounted(async () => {
  await auth.fetchMe();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Header */
.header {
  width: 92%;
  max-width: 1400px;
  margin: 18px auto;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 18px;
  border-radius: 60px;
  background: #fff;
  border: 2px solid #3a3a3a;
  justify-content: space-between;
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.burger {
  font-size: 26px;
  line-height: 1;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #111;
  padding: 8px;
}

.logo-center {
  position: absolute;
  left: 45%;
  transform: translateX(-50%);
}

.logo {
  height: 60px;
  width: auto;
  display: block;
  object-fit: contain;
}

.logo-mobile {
  display: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
}

.search-wrap {
  display: flex;
  align-items: center;
}

.search-input {
  height: 40px;
  padding: 8px 14px;
  border-radius: 22px;
  border: 1px solid #999;
  min-width: 220px;
  font-size: 15px;
}

.btn {
  display: inline-block;
  text-decoration: none;
  padding: 8px 18px;
  border-radius: 22px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.btn.join {
  background: #000;
  color: #fff;
}

.btn.outline {
  background: transparent;
  color: #000;
  border: 1px solid #000;
}

.btn:hover {
  opacity: 0.8;
}

.mobile-icons {
  display: none;
  gap: 12px;
  align-items: center;
}

.icon-btn {
  background: transparent;
  border: none;
  padding: 6px;
  cursor: pointer;
}

.icon-btn img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

/* Model Container */
.model-container {
  width: 92%;
  max-width: 1400px;
  margin: 40px auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 30px;
  min-height: 70vh;
}

/* Top Left - Product Image */
.model-image {
  grid-column: 1;
  grid-row: 1;
  border: 2px solid #3a3a3a;
  border-radius: 12px;
  padding: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.model-image img {
  width: 80%;
  max-width: 400px;
  height: 300px;
  object-fit: contain;
}

/* Top Right - Product Info */
.model-info {
  grid-column: 2;
  grid-row: 1;
  padding: 20px;
}

.model-name {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
}

.model-available {
  font-size: 18px;
  color: #4caf50;
  margin-bottom: 20px;
}

.model-available.unavailable {
  color: #d32f2f;
}

.model-price {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 25px;
}

.size-selection {
  margin-bottom: 30px;
}

.size-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.size-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.size-option {
  width: 50px;
  height: 50px;
  border: 2px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.size-option:hover {
  border-color: #3a3a3a;
}

.size-option.selected {
  background: #3a3a3a;
  color: #fff;
  border-color: #3a3a3a;
}

.action-buttons {
  display: flex;
  gap: 15px;
  align-items: center;
}

.add-to-cart {
  flex: 1;
  padding: 15px 25px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.add-to-cart:hover {
  background: #333;
}

.back-button {
  width: 50px;
  height: 50px;
  border: 2px solid #3a3a3a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s;
}

.back-button:hover {
  background: #f5f5f5;
}

/* Bottom Left - Buy Now Section */
.buy-now {
  grid-column: 1;
  grid-row: 2;
  border: 2px solid #3a3a3a;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.buy-now-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.buy-now-content {
  display: flex;
  gap: 20px;
  flex: 1;
}

.order-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.truck-icon {
  width: 60px;
  height: auto;
  margin-bottom: 15px;
}

.order-button {
  padding: 12px 20px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background 0.3s;
}

.order-button:hover {
  background: #333;
}

.pickup-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pickup-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pickup-option input {
  width: 18px;
  height: 18px;
}

.map-section {
  flex: 1;
}

.map-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* Bottom Frame */
.bottom-frame {
  width: 100%;
  margin-top: 40px;
}

.bottom-frame img {
  width: 100%;
  height: auto;
  display: block;
}

/* Mobile */
@media (max-width: 768px) {
  .header {
    width: 100%;
    margin: 12px 0 0 0;
    border-radius: 60px;
    padding: 12px 18px;
    background: #3a3a3a;
    border: 2px solid #3a3a3a;
    justify-content: flex-start;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: initial;
  }

  .burger {
    color: #fff;
  }

  .logo-center {
    position: static;
    transform: none;
    margin: 0 auto;
    flex: 1;
    text-align: center;
  }

  .logo-desktop {
    display: none;
  }

  .logo-mobile {
    display: block;
    height: 38px;
  }

  .mobile-icons {
    display: flex;
    margin-left: auto;
    flex: initial;
  }

  .mobile-icons img {
    filter: brightness(0) invert(1);
    width: 20px;
    height: 20px;
  }

  .header-right {
    display: none;
  }

  .model-container {
    width: 95%;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    gap: 20px;
    margin: 20px auto;
  }

  .model-image {
    grid-column: 1;
    grid-row: 1;
  }

  .model-info {
    grid-column: 1;
    grid-row: 2;
  }

  .buy-now {
    grid-column: 1;
    grid-row: 3;
  }

  .empty-section {
    grid-column: 1;
    grid-row: 4;
    display: none;
  }

  .buy-now-content {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
  }

  .back-button {
    align-self: center;
  }
}
</style>
