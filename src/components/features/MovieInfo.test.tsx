import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MovieInfo } from "./MovieInfo";
import type { MovieDetail } from "@/types/movieDetail";

jest.mock("@/utils/movie", () => ({
  formatReleaseDate: jest.fn((date) => `Formatted: ${date}`),
  formatRuntime: jest.fn((runtime) => `${runtime}min`),
}));

describe("MovieInfo", () => {
  const createMockMovie = (
    overrides: Partial<MovieDetail> = {}
  ): MovieDetail => ({
    id: 1,
    title: "Test Movie",
    original_title: "Test Movie",
    tagline: "Test tagline",
    release_date: "2025-01-01",
    runtime: 120,
    original_language: "en",
    status: "Released",
    genres: [
      { id: 1, name: "Action" },
      { id: 2, name: "Adventure" },
    ],
    vote_average: 8.5,
    vote_count: 1000,
    overview: "Test overview",
    poster_path: "/test.jpg",
    backdrop_path: "/backdrop.jpg",
    adult: false,
    popularity: 100,
    video: false,
    budget: 0,
    homepage: null,
    imdb_id: null,
    production_companies: [],
    production_countries: [],
    revenue: 0,
    spoken_languages: [],
    ...overrides,
  });

  const mockOnBookMovie = jest.fn();

  beforeEach(() => {
    mockOnBookMovie.mockClear();
  });

  it("renders movie title", () => {
    const movie = createMockMovie();
    render(<MovieInfo movie={movie} onBookMovie={mockOnBookMovie} />);
    expect(
      screen.getByRole("heading", { name: "Test Movie" })
    ).toBeInTheDocument();
  });

  it("renders tagline when provided", () => {
    const movie = createMockMovie();
    render(<MovieInfo movie={movie} onBookMovie={mockOnBookMovie} />);
    expect(screen.getByText("Test tagline")).toBeInTheDocument();
  });

  it("does not render tagline when not provided", () => {
    const movie = createMockMovie({ tagline: undefined });
    render(<MovieInfo movie={movie} onBookMovie={mockOnBookMovie} />);
    expect(screen.queryByText("Test tagline")).not.toBeInTheDocument();
  });

  it("renders movie details", () => {
    const movie = createMockMovie();
    render(<MovieInfo movie={movie} onBookMovie={mockOnBookMovie} />);

    expect(screen.getByText("Release Date")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders genres", () => {
    const movie = createMockMovie();
    render(<MovieInfo movie={movie} onBookMovie={mockOnBookMovie} />);

    expect(screen.getByText("Genres")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Adventure")).toBeInTheDocument();
  });

  it("handles missing runtime", () => {
    const movie = createMockMovie({ runtime: null });
    render(<MovieInfo movie={movie} onBookMovie={mockOnBookMovie} />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("calls onBookMovie when book button is clicked", async () => {
    const user = userEvent.setup();
    const movie = createMockMovie();
    render(<MovieInfo movie={movie} onBookMovie={mockOnBookMovie} />);

    const bookButton = screen.getByRole("button", {
      name: /book movie tickets/i,
    });
    await user.click(bookButton);

    expect(mockOnBookMovie).toHaveBeenCalledTimes(1);
  });
});
