import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import MovieCard from "./MovieCard";
import { MovieListingItem } from "@/types/movieListing";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/utils/movie", () => ({
  formatVoteAverage: jest.fn((rating: number) => rating.toFixed(1)),
  formatReleaseDate: jest.fn((date: string) => `Formatted: ${date}`),
}));

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
};

(useRouter as jest.Mock).mockReturnValue(mockRouter);

const mockMovie: MovieListingItem = {
  id: 123,
  title: "Test Movie",
  overview:
    "This is a test movie description that should be displayed on the card.",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  release_date: "2025-01-01",
  vote_average: 8.5,
  vote_count: 1000,
  popularity: 100.5,
  adult: false,
  genre_ids: [1, 2, 3],
  original_language: "en",
  original_title: "Test Movie Original",
  video: false,
};

describe("MovieCard", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders movie title correctly", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
  });

  it("renders movie overview", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText(mockMovie.overview)).toBeInTheDocument();
  });

  it("displays formatted vote average", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("⭐ 8.5")).toBeInTheDocument();
  });

  it("displays formatted release date", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("January 1, 2025")).toBeInTheDocument();
  });

  it("displays popularity score", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("Popularity: 101")).toBeInTheDocument();
  });

  it("renders poster image when poster_path exists", () => {
    render(<MovieCard movie={mockMovie} />);
    const image = screen.getByAltText("Test Movie");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w300/test-poster.jpg"
    );
  });

  it('shows "No Image" when poster_path is null', () => {
    const movieWithoutPoster = { ...mockMovie, poster_path: null };
    render(<MovieCard movie={movieWithoutPoster} />);
    expect(screen.getByText("No Image")).toBeInTheDocument();
  });

  it("navigates to movie detail when clicked", () => {
    render(<MovieCard movie={mockMovie} />);
    const card = screen.getByText("Test Movie").closest("div");

    fireEvent.click(card!);

    expect(mockPush).toHaveBeenCalledWith("/movie/123");
  });

  it("has cursor pointer and hover effects", () => {
    const { container } = render(<MovieCard movie={mockMovie} />);
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass(
      "cursor-pointer",
      "hover:shadow-lg",
      "hover:scale-105"
    );
  });

  it("handles missing overview gracefully", () => {
    const movieWithoutOverview = { ...mockMovie, overview: "" };
    render(<MovieCard movie={movieWithoutOverview} />);
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.queryByText(mockMovie.overview)).not.toBeInTheDocument();
  });

  it("handles loading attribute on image", () => {
    render(<MovieCard movie={mockMovie} />);
    const image = screen.getByAltText("Test Movie");
    expect(image).toHaveAttribute("loading", "lazy");
  });
});
