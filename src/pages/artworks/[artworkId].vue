<script lang="ts">
import {
  useArtworkDetails,
  useArtworkRelatedArtworks,
} from '@/loaders/artwork-details'
export { useArtworkDetails, useArtworkRelatedArtworks }
</script>

<script lang="ts" setup>
import ArtworkCard from '@/components/ArtworkCard.vue'

const { data: artwork } = useArtworkDetails()
const { data: relatedArtwork, status: relatedArtworkStatus } =
  useArtworkRelatedArtworks()
</script>

<template>
  <h1 class="sr-only">{{ artwork.title }}</h1>
  <header v-if="artwork.image_url" class="px-6 pb-4 space-y-2 bg-gray-100">
    <div class="py-12">
      <img
        :src="artwork.image_url"
        :alt="artwork.thumbnail?.alt_text"
        class="block max-w-full mx-auto w-screen-lg"
      />
    </div>
    <div class="flex justify-between space-x-2">
      <span v-if="artwork.is_public_domain">CC0 Public Domain Designation</span>
      <span v-else-if="artwork.copyright_notice">{{
        artwork.copyright_notice
      }}</span>
      <div class="flex-grow"></div>
      <div>
        <button class="bg-slate-800/35">Expand</button>
      </div>
    </div>
  </header>

  <div>
    <div class="flex flex-col pt-6 mx-auto prose">
      <span class="mt-6 font-serif text-4xl" aria-hidden="true">{{
        artwork.title
      }}</span>

      <h2 class="sr-only">Date:</h2>
      <p>{{ artwork.date_display }}</p>

      <h2 class="sr-only">Artist:</h2>
      <p>{{ artwork.artist_display }}</p>

      <h2 class="sr-only">About this artwork:</h2>
      <div v-html="artwork.description"></div>
    </div>

    <dl class="grid mx-auto my-6 max-w-prose">
      <dt>
        <h2>Artist</h2>
      </dt>
      <dd>
        <template v-if="artwork.artist_titles.length > 0">
          <!-- TODO: handle multiple artists -->
          <a :href="`#${artwork.artist_ids[0]}`">{{
            artwork.artist_titles[0]
          }}</a>
        </template>
        <span v-else>Unknown</span>
      </dd>

      <dt>
        <h2>Title</h2>
      </dt>
      <dd>
        <span>{{ artwork.title }}</span>
      </dd>

      <dt>
        <h2>Place</h2>
      </dt>
      <dd>
        <span>{{ artwork.place_of_origin }}</span>
      </dd>

      <dt>
        <h2>Date</h2>
      </dt>
      <dd>
        <span>{{ artwork.date_display }}</span>
      </dd>

      <dt>
        <h2>Medium</h2>
      </dt>
      <dd>
        <span>{{ artwork.medium_display }}</span>
      </dd>

      <template v-if="artwork.inscriptions">
        <dt>
          <h2>Inscriptions</h2>
        </dt>
        <dd>
          <span>{{ artwork.inscriptions }}</span>
        </dd>
      </template>

      <template v-if="artwork.dimensions">
        <dt>
          <h2>Dimensions</h2>
        </dt>
        <dd>
          <span>{{ artwork.dimensions }}</span>
        </dd>
      </template>

      <template v-if="artwork.credit_line">
        <dt>
          <h2>Credit Line</h2>
        </dt>
        <dd>
          <span>{{ artwork.credit_line }}</span>
        </dd>
      </template>

      <template v-if="artwork.main_reference_number">
        <dt>
          <h2>Reference Number</h2>
        </dt>
        <dd>
          <span>{{ artwork.main_reference_number }}</span>
        </dd>
      </template>

      <template v-if="artwork.copyright_notice">
        <dt>
          <h2>Copyright</h2>
        </dt>
        <dd>
          <span>{{ artwork.copyright_notice }}</span>
        </dd>
      </template>
    </dl>
  </div>

  <h2 class="sr-only">Extended information about this artwork</h2>

  <div class="mx-auto prose">
    <template v-if="artwork.publication_history.length > 0">
      <h3 class="uppercase">Publication History</h3>
      <ul>
        <li v-for="entry in artwork.publication_history" v-html="entry"></li>
      </ul>
    </template>

    <template v-if="artwork.exhibition_history.length > 0">
      <h3 class="uppercase">Exhibition History</h3>
      <ul>
        <li v-for="entry in artwork.exhibition_history" v-html="entry"></li>
      </ul>
    </template>

    <h3 class="uppercase">Provenance</h3>
    <p>{{ artwork.provenance_text }}</p>
  </div>

  <h2>Explore Further</h2>

  <h3 class="sr-only">Related artworks</h3>
  <div>
    <div v-if="relatedArtworkStatus === 'loading'">Loading...</div>
    <div class="masonry" v-else-if="relatedArtwork">
      <ArtworkCard
        v-for="artwork in relatedArtwork.data"
        :key="artwork.id"
        :artwork="artwork"
      />
    </div>
    <div v-else>No related artwork found.</div>
  </div>

  <pre>{{ artwork }}</pre>
</template>

<style scoped>
dl.grid {
  grid-template-columns: max-content auto;
}

dl h2 {
  @apply font-bold;
}
dl dt {
  @apply pr-6;
}
</style>
