"use client";

import { useState } from "react";
import ScrollHeader from "@/components/features/ScrollHeader";
import MovieCard from "@/components/ui/MovieCard";
import { useMovies } from "@/hooks/useMovies";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { SortOption } from "@/types/sortOptions";
import { DEFAULT_SORT } from "@/constants/movieSorts";

export default function Home() {
  const [sortBy, setSortBy] = useState<SortOption>(DEFAULT_SORT);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMovies(sortBy);

  // get movies from the paginated structure and deduplicate
  const allMovies = data?.pages.flatMap((page) => page.results) ?? [];
  const movies = allMovies.filter(
    (movie, index, self) => index === self.findIndex((m) => m.id === movie.id)
  );

  // infinite scroll hook
  const { lastElementRef } = useInfiniteScroll({
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 800,
  });

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
  };

  if (error) {
    return (
      <>
        <ScrollHeader sortBy={sortBy} onSortChange={handleSortChange} />
        <div className="pt-24 pb-8 px-6">
          <div className="text-center py-8">
            <p className="text-red-600">
              Error loading movies: {(error as Error).message}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ScrollHeader sortBy={sortBy} onSortChange={handleSortChange} />

      <div className="pt-24 pb-8 px-6">
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading movies...</p>
          </div>
        )}

        {movies.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {movies.map((movie, index) => {
                const isLastItem = index === movies.length - 1;
                return (
                  <div
                    key={`${movie.id}-${index}`}
                    ref={isLastItem ? lastElementRef : null}
                  >
                    <MovieCard movie={movie} />
                  </div>
                );
              })}
            </div>

            {isFetchingNextPage && (
              <div className="text-center mt-8 py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Loading more movies...</p>
              </div>
            )}

            {!hasNextPage && !isFetchingNextPage && (
              <div className="text-center mt-8 py-6">
                <div className="text-gray-500 text-sm">
                  🎬 You&apos;ve reached the end!
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  Found {movies.length} movies
                </div>
              </div>
            )}
          </>
        )}

        {!isLoading && movies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎬</div>
            <p className="text-gray-600 text-lg mb-2">No movies found</p>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters or check back later
            </p>
          </div>
        )}
      </div>
    </>
  );
}
