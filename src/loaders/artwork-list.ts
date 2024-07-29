import { getArtworksList } from '@/api/artworks'
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada'

export const useArtworkList = defineColadaLoader({
  key: () => ['artwork-list'],
  async query() {
    // TODO: Add pagination
    return getArtworksList({ page: 1, limit: 25 })
  },
})
