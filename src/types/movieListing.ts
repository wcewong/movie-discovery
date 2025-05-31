export interface MovieListing {
  page: number;
  results: MovieListingItem[];
  total_pages: number;
  total_results: number;
}

export interface MovieListingItem {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: any[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
