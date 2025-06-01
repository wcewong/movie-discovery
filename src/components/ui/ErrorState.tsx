interface ErrorStateProps {
  title: string;
  message: string;
  onBack: () => void;
}

export function ErrorState({ title, message, onBack }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-red-500 text-6xl mb-4">😔</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onBack}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
