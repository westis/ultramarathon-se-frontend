<template>
  <div class="podcasts-container">
    <h1 class="title">Podcast Episodes</h1>
    <div class="episodes-list">
      <div
        v-for="episode in episodes"
        :key="episode.slug.current"
        class="episode"
      >
        <img
          :src="episode.coverImageUrl"
          :alt="episode.title"
          class="cover-image"
        />
        <div class="episode-details">
          <h2>{{ episode.title }}</h2>
          <p class="publication-date">
            {{ new Date(episode.publicationDate).toLocaleDateString() }}
          </p>
          <!-- Safely access the first item of description and its text content -->
          <p class="description">
            {{
              episode.description?.[0]?.children?.[0]?.text ||
              "Description not available."
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const client = useSanity();

const episodes = ref([]);

const fetchEpisodes = async () => {
  episodes.value = await client.fetch(
    `*[_type == "podcastEpisode"]{
      title,
      "slug": slug.current,
      description,
      "coverImageUrl": coverImage.asset->url,
      publicationDate
    }`
  );
};

fetchEpisodes();
</script>

<style scoped>
.podcasts-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 40px;
}

.episodes-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.episode {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.cover-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.episode-details {
  flex: 1;
}

.publication-date {
  font-style: italic;
  color: #666;
}

.description {
  margin-top: 10px;
}
</style>
