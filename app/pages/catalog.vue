<template>
  <div>
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
          <div v-if="isLoading" class="loading">Loading products...</div>

          <template v-else>
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
                      <img :src="product.small_image" :alt="product.name" />
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
                      <img :src="product.small_image" :alt="product.name" />
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
                      <img :src="product.small_image" :alt="product.name" />
                    </div>
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-price">${{ product.price }}</div>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "~~/composables/useAuth";

const auth = useAuth();
const route = useRoute();

const { data: products, pending: isLoading } = useFetch(
  () => {
    const query = route.query.q ? `?q=${route.query.q}` : "";
    return `/api/products${query}`;
  },
  {
    immediate: true,
    watch: [() => route.query.q],
  },
);

const allProducts = computed(() => {
  if (!products.value) return [];
  return Array.isArray(products.value) ? products.value : [];
});

const premiumProducts = computed(() => allProducts.value.slice(0, 3));
const popularProducts = computed(() => allProducts.value.slice(3, 6));
const bestsellerProducts = computed(() => allProducts.value.slice(6, 9));

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

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #999;
}

/* Mobile */
@media (max-width: 768px) {
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
