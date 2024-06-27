// file path: /frontend/nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    strict: true,
    typeCheck: false,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/sanity",
    "@pinia/nuxt",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxtjs/google-fonts",
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
  },
  css: ["~/assets/css/tailwind.css"],
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
  },
});
