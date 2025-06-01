interface MoviePosterProps {
  posterPath?: string | null;
  title: string;
  voteAverage: number;
  voteCount: number;
}

export function MoviePoster({
  posterPath,
  title,
  voteAverage,
  voteCount,
}: MoviePosterProps) {
  return (
    <div className="md:w-1/3">
      <div className="aspect-[2/3] bg-gray-200 relative">
        {posterPath ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">🎬</div>
              <div>No Poster</div>
            </div>
          </div>
        )}

        {/* rating badge - top right */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">⭐</span>
            <span className="font-semibold">{voteAverage.toFixed(1)}</span>
          </div>
          <div className="text-xs text-gray-300 text-center">
            {voteCount.toLocaleString()} votes
          </div>
        </div>
      </div>
    </div>
  );
}
