import { formatReleaseDate, formatRuntime } from "@/utils/movie";
import type { MovieDetail } from "@/types/movieDetail";

interface MovieInfoProps {
  movie: MovieDetail;
  onBookMovie: () => void;
}

export function MovieInfo({ movie, onBookMovie }: MovieInfoProps) {
  return (
    <div className="md:w-2/3 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{movie.title}</h1>

      {movie.tagline && (
        <p className="text-lg text-gray-600 italic mb-4">{movie.tagline}</p>
      )}

      {/* quick info grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-1">Release Date</h3>
          <p className="text-gray-600">
            {formatReleaseDate(movie.release_date)}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-1">Duration</h3>
          <p className="text-gray-600">
            {movie.runtime ? formatRuntime(movie.runtime) : "Unknown"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-1">Language</h3>
          <p className="text-gray-600 uppercase">{movie.original_language}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-1">Status</h3>
          <p className="text-gray-600">{movie.status}</p>
        </div>
      </div>

      {/* Genres */}
      {movie.genres && movie.genres.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* book movie button */}
      <button
        onClick={onBookMovie}
        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
        Book Movie Tickets
      </button>
    </div>
  );
}
