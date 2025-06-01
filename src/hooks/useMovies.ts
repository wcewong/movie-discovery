import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api-client";
import { SortOption } from "@/types/sortOptions";
import { DEFAULT_SORT } from "@/constants/movieSorts";

// for better caching
export const movieQueryKeys = {
  all: ["movies"] as const,
  lists: () => [...movieQueryKeys.all, "list"] as const,
  list: (sortBy: SortOption) => [...movieQueryKeys.lists(), sortBy] as const,
  details: () => [...movieQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...movieQueryKeys.details(), id] as const,
  searches: () => [...movieQueryKeys.all, "search"] as const,
  search: (query: string) => [...movieQueryKeys.searches(), query] as const,
};

export const useMovies = (sortBy: SortOption = DEFAULT_SORT) => {
  return useInfiniteQuery({
    queryKey: movieQueryKeys.list(sortBy),
    queryFn: ({ pageParam = 1 }) =>
      movieApi.getMovies({ sortBy, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMovieDetail = (movieId: number | null) => {
  return useQuery({
    queryKey: movieQueryKeys.detail(movieId!),
    queryFn: () => movieApi.getMovieDetail(movieId!),
    enabled: !!movieId && movieId > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useSearchMovies = (
  query: string,
  options?: { enabled?: boolean }
) => {
  const { enabled = true } = options || {};

  return useInfiniteQuery({
    queryKey: movieQueryKeys.search(query),
    queryFn: ({ pageParam = 1 }) => movieApi.searchMovies(query, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: enabled && query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
