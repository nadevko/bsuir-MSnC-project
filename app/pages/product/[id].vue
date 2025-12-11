<template>
  <div>
    <!-- Model Content -->
    <!-- Хедера здесь больше нет, он придет из layouts/default.vue -->
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
          <div class="model-available">Model is available</div>
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
            <button class="add-to-cart" :disabled="!user" @click="addToCart">
              {{ user ? "ADD TO CART" : "LOGIN TO BUY" }}
            </button>
            <button class="back-button" @click="goBack">←</button>
          </div>
        </div>

        <!-- Bottom Left - Buy Now Section -->
        <div class="buy-now">
          <div class="buy-now-title">BUY NOW</div>
          <div class="buy-now-content">
            <div class="order-section">
              <img src="/assets/truck.png" alt="Delivery" class="truck-icon" />
              <button class="order-button" @click="buyNow">BUY NOW</button>
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
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "~~/composables/useAuth";
import { useCsrfToken } from "~~/composables/useCsrfToken";

const route = useRoute();
const auth = useAuth();
const user = computed(() => auth.user.value);

const productId = computed(() => route.params.id as string);
const selectedSize = ref(42);
const deliveryMethod = ref("store");

const sizes = [39, 40, 41, 42, 43, 44, 45];

const product = ref({
  name: "Nike Air Max 270",
  price: 150,
  brand: "Nike",
});

async function addToCart() {
  if (!user.value) return;

  try {
    const csrf = useCsrfToken();
    await $fetch("/api/cart", {
      method: "POST",
      body: {
        product_id: parseInt(productId.value),
        size: selectedSize.value,
        amount: 1,
      },
      headers: csrf.getHeader(),
    });
    alert(`Added ${product.value.name} (Size ${selectedSize.value}) to cart!`);
  } catch (error) {
    console.error("Failed to add to cart:", error);
    alert("Failed to add to cart");
  }
}

async function buyNow() {
  if (!user.value) return;

  try {
    const csrf = useCsrfToken();
    // Clear cart
    await $fetch("/api/cart/clear", {
      method: "POST",
      headers: csrf.getHeader(),
    });
    // Add product
    await $fetch("/api/cart", {
      method: "POST",
      body: {
        product_id: parseInt(productId.value),
        size: selectedSize.value,
        amount: 1,
      },
      headers: csrf.getHeader(),
    });
    // Redirect to profile
    await navigateTo("/profile");
  } catch (error) {
    console.error("Failed to buy now:", error);
    alert("Failed to buy now");
  }
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

/* 
   Стили Header удалены, так как они теперь в AppHeader.vue 
*/

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

.add-to-cart:hover:not(:disabled) {
  background: #333;
}

.add-to-cart:disabled {
  background: #999;
  cursor: not-allowed;
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
