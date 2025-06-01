export const API_ENDPOINTS = {
  MOVIES: {
    DISCOVER: "/movies/discover",
    SEARCH: "/movies/search",
    DETAIL: (movieId: number) => `/movies/${movieId}`,
  },
} as const;

export const TMDB_ENDPOINTS = {
  DISCOVER_MOVIE: "/discover/movie",
  SEARCH_MOVIE: "/search/movie",
  MOVIE_DETAIL: (movieId: number) => `/movie/${movieId}`,
} as const;

// URL builders
export const buildApiUrl = (
  endpoint: string,
  baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api"
) => {
  return `${baseUrl}${endpoint}`;
};

export const buildTMDBUrl = (endpoint: string, baseUrl: string) => {
  return `${baseUrl}${endpoint}`;
};
