interface MovieSynopsisProps {
  overview?: string;
}

export function MovieSynopsis({ overview }: MovieSynopsisProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Synopsis</h2>
      {overview ? (
        <p className="text-gray-700 leading-relaxed text-lg">{overview}</p>
      ) : (
        <p className="text-gray-500 italic">No synopsis available.</p>
      )}
    </div>
  );
}
