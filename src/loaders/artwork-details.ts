import { getArtwork, searchArtworks } from '@/api/artworks'
import { defineColadaLoader } from 'unplugin-vue-router/data-loaders/pinia-colada'

export const useArtworkDetails = defineColadaLoader('/artworks/[artworkId]', {
  key: (to) => ['artwork-details', to.params.artworkId],
  async query(to) {
    return getArtwork(to.params.artworkId)
  },
})

export const useArtworkRelatedArtworks = defineColadaLoader(
  '/artworks/[artworkId]',
  {
    lazy: true,
    key: (to) => ['artwork-related-artworks', to.params.artworkId],
    async query(to) {
      const artwork = await useArtworkDetails()
      const relatedArtworks = await searchArtworks({
        query: {
          term: {
            style_id: artwork.style_ids[0],
          },
        },
        limit: 12,
      })
      return {
        ...relatedArtworks,
        // remove ourself from the related artworks
        data: relatedArtworks.data.filter((a) => a.id !== artwork.id),
      }
    },
  },
)
