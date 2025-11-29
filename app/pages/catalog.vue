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
            src="/assets/logomob.png"
            alt="Ezzy Step"
            class="logo logo-mobile"
          />
        </NuxtLink>
      </div>

      <!-- Desktop right -->
      <div class="header-right">
        <div class="search-wrap">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Search"
          />
        </div>
        <NuxtLink v-if="!user" to="/register" class="btn join"
          >JOIN NOW</NuxtLink
        >
        <NuxtLink v-if="!user" to="/login" class="btn outline">LOG IN</NuxtLink>
        <NuxtLink v-if="user" to="/profile" class="btn outline"
          >PROFILE</NuxtLink
        >
      </div>

      <!-- Mobile icons -->
      <div class="mobile-icons" aria-hidden="true">
        <button class="icon-btn" aria-label="notifications">
          <img src="/assets/bell.png" alt="" />
        </button>
        <button class="icon-btn" aria-label="search">
          <img src="/assets/search.png" alt="" />
        </button>
      </div>
    </header>

    <!-- Catalog Content -->
    <main>
      <div class="catalog-container">
        <!-- Left column with large images -->
        <div class="catalog-left">
          <div class="large-image">
            <img src="/assets/catalog-left1.png" alt="Sneaker Collection 1" />
          </div>
          <div class="large-image">
            <img src="/assets/catalog-left2.png" alt="Sneaker Collection 2" />
          </div>
          <div class="large-image">
            <img src="/assets/catalog-left3.png" alt="Sneaker Collection 3" />
          </div>
        </div>

        <!-- Right column with product grid -->
        <div class="catalog-right">
          <!-- Level 1 -->
          <div class="catalog-level">
            <div class="level-title">Premium Collection</div>
            <div class="products-grid">
              <div
                v-for="product in premiumProducts"
                :key="product.id"
                class="product-card"
              >
                <NuxtLink :to="`/product/${product.id}`" class="product-link">
                  <div class="product-image">
                    <img
                      :src="`/assets/${product.image}`"
                      :alt="product.name"
                    />
                  </div>
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-price">${{ product.price }}</div>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Level 2 -->
          <div class="catalog-level">
            <div class="level-title">Popular Brands</div>
            <div class="products-grid">
              <div
                v-for="product in popularProducts"
                :key="product.id"
                class="product-card"
              >
                <NuxtLink :to="`/product/${product.id}`" class="product-link">
                  <div class="product-image">
                    <img
                      :src="`/assets/${product.image}`"
                      :alt="product.name"
                    />
                  </div>
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-price">${{ product.price }}</div>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Level 3 -->
          <div class="catalog-level">
            <div class="level-title">Best Sellers</div>
            <div class="products-grid">
              <div
                v-for="product in bestsellerProducts"
                :key="product.id"
                class="product-card"
              >
                <NuxtLink :to="`/product/${product.id}`" class="product-link">
                  <div class="product-image">
                    <img
                      :src="`/assets/${product.image}`"
                      :alt="product.name"
                    />
                  </div>
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-price">${{ product.price }}</div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuth } from "~~/composables/useAuth";

const auth = useAuth();
const user = computed(() => auth.user.value);
const searchQuery = ref("");

const premiumProducts = ref([
  {
    id: 1,
    name: "Nike Air Max 270",
    price: 150,
    image: "product/1/main.png",
  },
  {
    id: 2,
    name: "Adidas Ultraboost 22",
    price: 180,
    image: "product/2/main.png",
  },
  {
    id: 3,
    name: "New Balance 990v5",
    price: 175,
    image: "product/3/main.png",
  },
]);

const popularProducts = ref([
  {
    id: 4,
    name: "Nike LeBron 19",
    price: 200,
    image: "product/4/main.png",
  },
  {
    id: 5,
    name: "Jordan XXXVI",
    price: 185,
    image: "product/5/main.png",
  },
  {
    id: 6,
    name: "Under Armour Curry 9",
    price: 160,
    image: "product/6/main.png",
  },
]);

const bestsellerProducts = ref([
  {
    id: 7,
    name: "Adidas Stan Smith",
    price: 85,
    image: "product/7/main.png",
  },
  {
    id: 8,
    name: "Nike Air Force 1",
    price: 100,
    image: "product/8/main.png",
  },
  {
    id: 9,
    name: "Vans Old Skool",
    price: 60,
    image: "product/9/main.png",
  },
]);

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

/* Catalog Layout */
.catalog-container {
  width: 92%;
  max-width: 1400px;
  margin: 40px auto;
  display: flex;
  gap: 40px;
}

.catalog-left {
  width: 33.33%;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.large-image {
  width: 100%;
}

.large-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.catalog-right {
  width: 66.67%;
}

.catalog-level {
  margin-bottom: 60px;
}

.level-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

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

  .catalog-container {
    width: 95%;
    flex-direction: column;
    gap: 30px;
    margin: 20px auto;
  }

  .catalog-left,
  .catalog-right {
    width: 100%;
  }

  .catalog-left {
    order: 2;
  }

  .large-image img {
    height: 200px;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .product-image img {
    height: 200px;
  }

  .level-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
