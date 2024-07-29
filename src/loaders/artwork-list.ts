import { getArtworkList } from '@/api/artworks'
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada'

export const useArtworkList = defineColadaLoader({
  key: () => ['artwork-list'],
  async query() {
    // TODO: Add pagination
    return getArtworkList({ page: 1, limit: 25 })
  },
})
