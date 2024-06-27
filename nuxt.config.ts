// file path: /frontend/nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    typeCheck: true,
  },
  modules: [
    // "@nuxtjs/tailwindcss",
    "@nuxtjs/sanity",
    "@pinia/nuxt",
    // "@nuxtjs/eslint-module",
    "@nuxt/image",
    // "@nuxtjs/color-mode",
    "@nuxt/ui",
    // "nuxt-icon",
    // "@nuxtjs/google-fonts",
    // "@nuxtjs/i18n",
    // "@nuxtjs/sitemap",
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },
  colorMode: {
    preference: "system", // default value of $colorMode.preference
    fallback: "light", // fallback value if not system preference found
    classSuffix: "",
  },
});
