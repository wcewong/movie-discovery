export interface MovieDetail {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  video: boolean;
  runtime: number | null;
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  homepage: string | null;
  imdb_id: string | null;

  genres: Array<{
    id: number;
    name: string;
  }>;

  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;

  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;

  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
}
