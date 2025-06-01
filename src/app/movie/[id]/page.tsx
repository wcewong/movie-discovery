"use client";

import { useParams, useRouter } from "next/navigation";
import { useMovieDetail } from "@/hooks/useMovies";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { MoviePoster } from "@/components/features/MoviePoster";
import { MovieInfo } from "@/components/features/MovieInfo";
import { MovieSynopsis } from "@/components/features/MovieSynopsis";
import { MovieAdditionalDetails } from "@/components/features/MovieAdditionalDetails";

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = parseInt(params.id as string);

  const { data: movie, isLoading, error } = useMovieDetail(movieId);

  const handleBookMovie = () => {
    window.open("https://www.cathaycineplexes.com.sg/", "_blank");
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading movie details..." />;
  }

  if (error || !movie) {
    return (
      <ErrorState
        title="Movie Not Found"
        message={error ? (error as Error).message : "This movie doesn't exist"}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title={movie.title} onBack={() => router.back()} />

      <div className="px-4 py-6">
        {/* Movie Poster and Basic Info */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="md:flex">
            <MoviePoster
              posterPath={movie.poster_path}
              title={movie.title}
              voteAverage={movie.vote_average}
              voteCount={movie.vote_count}
            />
            <MovieInfo movie={movie} onBookMovie={handleBookMovie} />
          </div>
        </div>

        <MovieSynopsis overview={movie.overview} />
        <MovieAdditionalDetails movie={movie} />
      </div>
    </div>
  );
}
