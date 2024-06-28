<template>
  <div
    class="relative flex w-full overflow-hidden text-white custom-width mx-auto"
  >
    <div class="grid grid-cols-1 md:grid-cols-3 gap-1 w-full">
      <div class="relative col-span-2">
        <img
          src="/images/hero-image.jpg"
          alt="Hero Image"
          class="w-full object-cover h-full"
        />
        <div class="absolute inset-0 flex items-end">
          <div class="bg-ultra-primary-900 bg-opacity-60 p-4 w-full">
            <h1 class="text-xl lg:text-3xl font-bold">
              Succé i Sydafrika, banrekord av Rabe, 16-årig Rapp sprang långt
              och ingen mer backyard av Sweden Runners
            </h1>
            <div class="flex justify-between items-center mt-1">
              <p class="text-sm lg:text-base">ULTRAAKTUELLT / 2024-06-27</p>
              <button
                class="btn btn-lg bg-ultra-primary-200 dark:bg-ultra-primary-900 text-black dark:text-white"
              >
                Lyssna
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-between">
        <div
          class="p-4 bg-ultra-secondary-200 dark:bg-ultra-secondary-800 text-black dark:text-white text-base md:text-sm lg:text-base xl:text-lg mb-2 ml-4 flex-grow"
        >
          <h2
            class="text-xl md:text-lg lg:text-xl xl:text-2xl font-bold text-ultra-secondary-800 dark:text-ultra-secondary-200"
          >
            Kommande ultratävlingar
          </h2>
          <ul>
            <li>26 jun Kullamannen - 100 miles</li>
            <li>26 jun Sätila Trail</li>
            <li>27 jun Personliga Rekordens Backyard</li>
            <li>27 jun Comrades Marathon (RSA)</li>
            <li>27 jun Western States (USA)</li>
          </ul>
        </div>
        <div
          class="p-4 bg-ultra-tertiary-200 dark:bg-ultra-tertiary-800 text-black dark:text-white text-base md:text-sm lg:text-base xl:text-lg mt-2 ml-4 flex-grow flex flex-col justify-between"
        >
          <div>
            <h2
              class="text-xl md:text-lg lg:text-xl xl:text-2xl font-bold text-ultra-tertiary-800 dark:text-ultra-tertiary-200"
            >
              Resultat & statistik
            </h2>
            <p>Se resultat, löparprofiler och annan statistik.</p>
          </div>
          <button
            class="mt-2 btn bg-ultra-tertiary-700 dark:bg-ultra-tertiary-300 text-white dark:text-black self-end"
          >
            Till statistik
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Add any necessary setup code here
</script>

<style scoped></style>
