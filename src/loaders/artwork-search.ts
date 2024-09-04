import { searchArtworks } from '@/api/artworks'

export const useArtworkSearchResults = defineColadaLoader({
  staleTime: 1000 * 60 * 60, // 1 hour
  key: (to) => ['artwork-search', { q: to.query.q }],
  async query(to) {
    return searchArtworks({
      q: String(to.query.q),
      term: {
        is_public_domain: true,
      },
    })
  },
})
