import { MovieDetail } from "@/types/movieDetail";
import { MovieListing } from "@/types/movieListing";
import { SortOption } from "@/types/sortOptions";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
  }

  private async request<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API Error: ${response.status} ${
          errorData.error || response.statusText
        }`
      );
    }

    return response.json();
  }

  // discover movies with sorting and pagination
  async getMovies({
    sortBy,
    page = 1,
  }: {
    sortBy: SortOption;
    page?: number;
  }): Promise<MovieListing> {
    return this.request<MovieListing>(API_ENDPOINTS.MOVIES.DISCOVER, {
      sort_by: sortBy,
      page: page.toString(),
    });
  }

  // get movie details by ID
  async getMovieDetail(movieId: number): Promise<MovieDetail> {
    return this.request<MovieDetail>(API_ENDPOINTS.MOVIES.DETAIL(movieId));
  }

  // search movies with pagination
  async searchMovies(query: string, page: number = 1): Promise<MovieListing> {
    return this.request<MovieListing>(API_ENDPOINTS.MOVIES.SEARCH, {
      query,
      page: page.toString(),
    });
  }
}

export const apiClient = new APIClient();

export const movieApi = {
  getMovies: apiClient.getMovies.bind(apiClient),
  getMovieDetail: apiClient.getMovieDetail.bind(apiClient),
  searchMovies: apiClient.searchMovies.bind(apiClient),
};
