import type { MovieDetail } from "@/types/movieDetail";

interface MovieAdditionalDetailsProps {
  movie: MovieDetail;
}

export function MovieAdditionalDetails({ movie }: MovieAdditionalDetailsProps) {
  const hasAdditionalDetails =
    movie.production_companies?.length > 0 ||
    movie.budget > 0 ||
    movie.revenue > 0;

  if (!hasAdditionalDetails) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Additional Details
      </h2>

      {movie.production_companies && movie.production_companies.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">
            Production Companies
          </h3>
          <div className="flex flex-wrap gap-2">
            {movie.production_companies.map((company) => (
              <span
                key={company.id}
                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
              >
                {company.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {(movie.budget > 0 || movie.revenue > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {movie.budget > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Budget</h3>
              <p className="text-gray-600">${movie.budget.toLocaleString()}</p>
            </div>
          )}

          {movie.revenue > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Revenue</h3>
              <p className="text-gray-600">${movie.revenue.toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
