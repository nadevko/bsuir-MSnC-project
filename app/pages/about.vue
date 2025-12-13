<template>
  <main class="max-w-7xl mx-auto px-4 py-16 space-y-24">
    <!-- Hero Title -->
    <section class="text-center space-y-6">
      <h1 class="text-5xl md:text-6xl font-extrabold leading-tight">Read it on our Blog</h1>
      <p class="text-gray-600 text-lg md:text-xl">The latest insights, stories, and guides from Ezzy Step.</p>
    </section>

    <!-- First Row: Text - Image - Text -->
    <section class="grid md:grid-cols-3 gap-8 items-center">
      <div class="space-y-4 text-center md:text-left">
        <h2 class="text-3xl md:text-4xl font-bold">The Ultimate Guide to Writing</h2>
        <p class="text-gray-700 leading-relaxed">Writing effectively is an art. Use simple, everyday words, be clear and direct, keep thoughts flowing logically, and aim for brevity.</p>
        <p class="text-gray-700 leading-relaxed">Our ideas have a purpose, so choose words that accurately express them.</p>
      </div>

      <div class="flex justify-center">
        <img src="/assets/about1.png" alt="Writing Guide" class="rounded-xl shadow-lg w-full max-w-md object-cover">
      </div>

      <div class="space-y-4 text-center md:text-left">
        <h2 class="text-3xl md:text-4xl font-bold">Clarity is Key</h2>
        <p class="text-gray-700 leading-relaxed">Start by using simple words people can easily understand. Be direct and keep your writing clear and concise.</p>
        <p class="text-gray-700 leading-relaxed">Ensure grammar is flawless, as it impacts credibility. Use active voice wherever possible.</p>
      </div>
    </section>

    <!-- Second Row: Image - Text - Image -->
    <section class="grid md:grid-cols-3 gap-8 items-center">
      <div class="flex justify-center md:justify-start">
        <img src="/assets/about2.png" alt="Writing Image 1" class="rounded-xl shadow-lg w-full max-w-sm object-cover border-2 border-gray-900">
      </div>

      <div class="space-y-4 text-center md:text-center">
        <h2 class="text-3xl md:text-4xl font-bold">Precision & Style</h2>
        <p class="text-gray-700 leading-relaxed">Clear, structured, and purpose-driven content resonates with readers. Focus on logical flow and readability.</p>
      </div>

      <div class="flex justify-center md:justify-end">
        <img src="/assets/about3.png" alt="Writing Image 2" class="rounded-xl shadow-lg w-full max-w-sm object-cover border-2 border-gray-900">
      </div>
    </section>

    <!-- Third Row: Text - Image - Text -->
    <section class="grid md:grid-cols-3 gap-8 items-center">
      <div class="space-y-4 text-center md:text-left">
        <p class="text-gray-700 leading-relaxed">Writing effectively is an art. Start by using simple, everyday words. Be clear and direct. Keep thoughts flowing logically, and aim for brevity unless writing long-form.</p>
      </div>

      <div class="flex justify-center">
        <img src="/assets/about4.png" alt="Writing Image 3" class="rounded-xl shadow-lg w-full max-w-md object-cover">
      </div>

      <div class="space-y-4 text-center md:text-left">
        <p class="text-gray-700 leading-relaxed">Choose words that express your ideas accurately. Proper grammar impacts credibility. Use active voice to make narratives easier to read.</p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
// Пока тут нет динамических данных, всё статично
</script>

<style scoped>
/* Можно добавить плавный hover для картинок */
img:hover {
  transform: scale(1.03);
  transition: transform 0.3s;
}
</style>
