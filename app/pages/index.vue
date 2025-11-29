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

      <!-- Desktop right: search + join + log in -->
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
        <button v-if="user" @click="onLogout" class="btn outline">
          LOG OUT
        </button>
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

    <!-- HERO SECTION -->
    <main>
      <section class="hero-grid">
        <div class="hero-photos">
          <div class="photo left">
            <img src="/assets/hero1.png" alt="hero 1" />
          </div>
          <div class="photo right">
            <img src="/assets/hero2.png" alt="hero 2" />
          </div>
        </div>

        <!-- Collection section -->
        <aside class="collection">
          <h3 class="collection-title">New Collection</h3>
          <div class="collection-logos">
            <NuxtLink to="/catalog" class="brand-link"
              ><img src="/assets/adidas.png" alt="adidas"
            /></NuxtLink>
            <NuxtLink to="/catalog" class="brand-link"
              ><img src="/assets/nike.png" alt="nike"
            /></NuxtLink>
            <NuxtLink to="/catalog" class="brand-link"
              ><img src="/assets/puma.png" alt="puma"
            /></NuxtLink>
            <NuxtLink to="/catalog" class="brand-link"
              ><img src="/assets/jordan.png" alt="jordan"
            /></NuxtLink>
            <NuxtLink to="/catalog" class="brand-link"
              ><img src="/assets/carhartt.png" alt="carhartt"
            /></NuxtLink>
          </div>
        </aside>
      </section>

      <!-- BRANDS MOBILE -->
      <section class="brands-mobile">
        <div class="brand-list">
          <NuxtLink href="#" class="brand-link"
            ><img src="/assets/nike.png" alt="nike"
          /></NuxtLink>
          <NuxtLink href="#" class="brand-link"
            ><img src="/assets/adidas.png" alt="adidas"
          /></NuxtLink>
          <NuxtLink href="#" class="brand-link"
            ><img src="/assets/puma.png" alt="puma"
          /></NuxtLink>
          <NuxtLink href="#" class="brand-link"
            ><img src="/assets/jordan.png" alt="jordan"
          /></NuxtLink>
          <NuxtLink href="#" class="brand-link"
            ><img src="/assets/carhartt.png" alt="carhartt"
          /></NuxtLink>
        </div>
      </section>

      <!-- INFO CARD -->
      <section class="info-card">
        <div class="advantages">
          <div class="adv-item">
            <img src="/assets/store.png" alt="" />
            <p>Stores across<br />the country</p>
          </div>
          <div class="adv-item">
            <img src="/assets/check.png" alt="" />
            <p>100% original</p>
          </div>
          <div class="adv-item">
            <img src="/assets/truck.png" alt="" />
            <p>Fast shipping</p>
          </div>
        </div>

        <div class="about-mini">
          <NuxtLink to="/about" class="about-us-link">
            <h2>About Us</h2>
          </NuxtLink>
        </div>
      </section>

      <!-- ABOUT SECTION -->
      <section class="about">
        <div class="about-content">
          <div class="about-text-col">
            <p>
              Writing effectively is an art. Start by using simple, everyday
              words people can easily understand. Be clear and direct to the
              point. Keep your thoughts flowing logically, and aim for brevity
              unless you're writing in the long form.
            </p>
          </div>

          <div class="about-text-col">
            <p>
              Writing effectively is an art. Start by using simple, everyday
              words people can easily understand. Be clear and direct to the
              point. Keep your thoughts flowing logically, and aim for brevity
              unless you're writing in the long form.
            </p>
          </div>

          <div class="about-map">
            <img src="/assets/map.png" alt="map" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAuth } from "~~/composables/useAuth";

const auth = useAuth();
const user = computed(() => auth.user.value);

async function onLogout() {
  try {
    await auth.logout();
    await navigateTo("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

onMounted(async () => {
  await auth.fetchMe();
});
</script>

<style scoped>
/* Base */
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

/* Hero Grid */
.hero-grid {
  width: 92%;
  max-width: 1400px;
  margin: 22px auto;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 28px;
  align-items: start;
}

.hero-photos {
  display: flex;
  gap: 20px;
}

.photo {
  flex: 1;
}

.photo img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 6px;
  border: 4px solid #eee;
}

/* Collection */
.collection {
  padding-top: 6px;
}

.collection-title {
  font-size: 28px;
  margin-bottom: 14px;
  font-weight: 700;
}

.collection-logos {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
}

.brand-link {
  display: block;
  text-decoration: none;
}

.collection-logos img {
  width: 90px;
  height: auto;
  display: block;
}

/* Brands Mobile */
.brands-mobile {
  display: none;
}

/* Info Card */
.info-card {
  width: 92%;
  max-width: 1400px;
  margin: 40px auto;
  border-radius: 22px;
  border: 2px solid #000;
  background: #fff;
  padding: 26px 20px;
}

.advantages {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.adv-item {
  text-align: center;
  width: 32%;
}

.adv-item img {
  width: 80px;
  height: auto;
  display: block;
  margin: 0 auto 8px;
}

.adv-item p {
  font-weight: 700;
  font-size: 16px;
  line-height: 1.2;
}

.about-mini {
  margin-top: 14px;
}

.about-us-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.about-us-link h2 {
  font-size: 34px;
  text-decoration: underline;
  text-underline-offset: 6px;
  font-weight: 800;
  margin-top: 12px;
  cursor: pointer;
}

/* About Section */
.about {
  width: 92%;
  max-width: 1400px;
  margin: 40px auto 80px;
  padding: 0 4px;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr 420px;
  gap: 24px;
  align-items: start;
}

.about-text-col p {
  font-size: 15px;
  line-height: 1.75;
  color: #222;
}

.about-map img {
  width: 100%;
  height: auto;
  border-radius: 8px;
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

  .hero-grid {
    display: block;
    width: calc(100% - 32px);
    margin: 18px auto;
  }

  .hero-photos {
    display: flex;
    gap: 0;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid #3a3a3a;
    background: #fff;
    height: 260px;
  }

  .hero-photos .photo {
    flex: 1;
    position: relative;
  }

  .hero-photos .photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .hero-photos .photo.left {
    border-right: 2px solid #3a3a3a;
  }

  .hero-photos .photo.right::after {
    content: "›";
    position: absolute;
    right: 12px;
    bottom: 12px;
    background: #fff;
    color: #111;
    border-radius: 50%;
    padding: 8px 10px;
    font-size: 20px;
    border: 2px solid #3a3a3a;
  }

  .collection {
    display: none;
  }

  .brands-mobile {
    display: block;
    width: 100%;
    padding: 18px 14px 0 14px;
  }

  .brand-list {
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    justify-content: center;
    align-items: center;
  }

  .brand-link img {
    width: 42%;
    max-width: 140px;
    display: block;
  }

  .info-card {
    margin: 20px 14px;
    padding: 20px;
    border-radius: 22px;
    border: 2px solid #000;
  }

  .advantages {
    flex-direction: row;
    gap: 8px;
  }

  .adv-item {
    width: 33%;
  }

  .adv-item img {
    width: 56px;
  }

  .adv-item p {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.1;
  }

  .about-us-link h2 {
    font-size: 32px;
    text-align: left;
    margin-top: 18px;
  }

  .about {
    display: none;
  }
}
</style>
