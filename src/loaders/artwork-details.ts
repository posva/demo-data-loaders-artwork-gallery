import { getArtwork, searchArtworks } from '@/api/artworks'

export const useArtworkDetails = defineColadaLoader('/artworks/[artworkId]', {
  staleTime: 1000 * 60 * 60, // 1 hour
  key: (to) => ['artwork-details', to.params.artworkId],
  async query(to) {
    return getArtwork(to.params.artworkId)
  },
})

export const useArtworkRelatedArtworks = defineColadaLoader(
  '/artworks/[artworkId]',
  {
    staleTime: 1000 * 60 * 60, // 1 hour
    lazy: true,
    key: (to) => ['artwork-related-artworks', to.params.artworkId],
    async query(to) {
      const artwork = await useArtworkDetails()
      const relatedArtworks = await searchArtworks({
        query: {
          term: {
            // TODO: might be undefined
            style_id: artwork.style_ids[0],
            // TODO: exclude itself
          },
        },
        limit: 13,
      })
      return {
        ...relatedArtworks,
        // remove ourself from the related artworks
        data: relatedArtworks.data.filter((a) => a.id !== artwork.id),
      }
    },
  },
)
