<script setup lang="ts">
import type { ArtworkColor, ArtworkDetails } from '@/api/artworks'
import { useRouteQueryValue } from '@/composables/router'
import { useRouter } from 'vue-router'

const { data: searchResults, asyncStatus } = useArtworkSearchResults()

const filters = useRouteQueryO<{
  is_public_domain?: boolean
  color: ArtworkColor
  place_ids: string
  date_range: [start: string, end: string]
}>(
  {
    is_public_domain: undefined,
    color: undefined,
    place_ids: undefined,
    date_range: undefined,
  },
  {
    deleteIf(value, key) {
      if (key === 'color') {
        return !value
      } else if (key === 'is_public_domain') {
        return value == null
      }
      return false
    },
  },
)

const router = useRouter()

function resetFilters() {
  filters.value = {
    color: undefined,
    is_public_domain: undefined,
    date_range: undefined,
    place_ids: undefined,
  }
}
</script>

<template>
  <section class="prose">
    <h3 class="font-serif">Search</h3>

    <pre>{{ filters }}</pre>

    <label class="w-full max-w-xs form-control">
      <div class="label">
        <span class="label-text">Legal:</span>
      </div>
      <select
        class="w-full max-w-xs select select-bordered"
        v-model="filters.is_public_domain"
      >
        <option :value="undefined">Any</option>
        <option :value="true">Public Domain</option>
        <option :value="false">Copyrighted</option>
      </select>
    </label>

    <form class="form-control" @submit.prevent @reset.prevent="resetFilters()">
      <button type="submit">Apply Filters</button>
      <button type="reset">Reset filters</button>
    </form>
  </section>

  <main>
    <div class="masonry">
      <ArtworkCard
        v-for="artwork in searchResults.data"
        :key="artwork.id"
        :artwork="artwork"
      />
    </div>
  </main>
</template>
