interface PageHeaderProps {
  title: string;
  onBack: () => void;
}

export function PageHeader({ title, onBack }: PageHeaderProps) {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {title}
        </h1>
        <div className="w-16"></div> {/* spacer for centering */}
      </div>
    </div>
  );
}
