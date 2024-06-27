<template>
  <div class="relative flex w-full overflow-hidden text-white mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
      <div class="relative col-span-2">
        <img
          src="/images/hero-image.jpg"
          alt="Hero Image"
          class="w-full object-cover h-full"
        />
        <div class="absolute inset-0 flex items-end">
          <div class="bg-black bg-opacity-60 p-4 w-full">
            <h1 class="text-xl lg:text-3xl font-bold">
              Succé i Sydafrika, banrekord av Rabe, 16-årig Rapp sprang långt
              och ingen mer backyard av Sweden Runners
            </h1>
            <div class="flex justify-between items-center mt-1">
              <p class="text-sm lg:text-base">ULTRAAKTUELLT / 2024-06-27</p>
              <button class="btn btn-lg bg-primary-500 text-white">
                Lyssna
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col justify-between">
        <div class="p-4 bg-orange-200 text-black mb-2 ml-4 flex-grow">
          <h2 class="text-xl font-bold text-black">Kommande ultratävlingar</h2>
          <ul>
            <li>26 jun Kullamannen - 100 miles</li>
            <li>26 jun Sätila Trail</li>
            <li>27 jun Personliga Rekordens Backyard</li>
            <li>27 jun Comrades Marathon (RSA)</li>
            <li>27 jun Western States (USA)</li>
          </ul>
        </div>
        <div
          class="p-4 bg-orange-100 text-black mt-2 ml-4 flex-grow flex flex-col justify-between"
        >
          <div>
            <h2 class="text-xl font-bold text-black">Resultat & statistik</h2>
            <p>Se resultat, löparprofiler och annan statistik.</p>
          </div>
          <button class="mt-2 btn bg-primary-500 text-white self-end">
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
