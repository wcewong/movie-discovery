"use client";

import { useRouter } from "next/navigation";
import { MovieListingItem } from "@/types/movieListing";
import { formatVoteAverage, formatReleaseDate } from "@/utils/movie";

interface MovieCardProps {
  movie: MovieListingItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/movie/${movie.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer transform hover:scale-105"
    >
      {/* poster placeholder */}
      <div className="aspect-[2/3] bg-gray-200 relative">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* rating badge - top right */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-medium">
          ⭐ {formatVoteAverage(movie.vote_average)}
        </div>
      </div>

      {/* movie info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
          {movie.title}
        </h3>

        <p className="text-gray-600 text-sm mb-1">
          {formatReleaseDate(movie.release_date)}
        </p>

        <p className="text-gray-600 text-sm">
          Popularity: {Math.round(movie.popularity)}
        </p>

        {movie.overview && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">
            {movie.overview}
          </p>
        )}
      </div>
    </div>
  );
}
