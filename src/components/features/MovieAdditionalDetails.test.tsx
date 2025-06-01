import { render, screen } from "@testing-library/react";
import { MovieAdditionalDetails } from "./MovieAdditionalDetails";
import type { MovieDetail } from "@/types/movieDetail";

describe("MovieAdditionalDetails", () => {
  const createMockMovie = (
    overrides: Partial<MovieDetail> = {}
  ): MovieDetail => ({
    id: 1,
    title: "Test Movie",
    original_title: "Test Movie",
    overview: "Test overview",
    poster_path: "/test.jpg",
    backdrop_path: "/backdrop.jpg",
    release_date: "2024-01-01",
    adult: false,
    vote_average: 8.5,
    vote_count: 1000,
    popularity: 100,
    video: false,
    original_language: "en",
    budget: 0,
    homepage: null,
    imdb_id: null,
    production_companies: [],
    production_countries: [],
    revenue: 0,
    runtime: 120,
    spoken_languages: [],
    status: "Released",
    tagline: null,
    genres: [],
    ...overrides,
  });

  it("renders nothing when no additional details are available", () => {
    const movie = createMockMovie();
    const { container } = render(<MovieAdditionalDetails movie={movie} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders production companies when available", () => {
    const movie = createMockMovie({
      production_companies: [
        { id: 1, name: "Warner Bros", logo_path: null, origin_country: "US" },
        {
          id: 2,
          name: "Universal Pictures",
          logo_path: null,
          origin_country: "US",
        },
      ],
    });

    render(<MovieAdditionalDetails movie={movie} />);

    expect(screen.getByText("Additional Details")).toBeInTheDocument();
    expect(screen.getByText("Production Companies")).toBeInTheDocument();
    expect(screen.getByText("Warner Bros")).toBeInTheDocument();
    expect(screen.getByText("Universal Pictures")).toBeInTheDocument();
  });

  it("renders budget when greater than 0", () => {
    const movie = createMockMovie({
      budget: 100000000,
    });

    render(<MovieAdditionalDetails movie={movie} />);

    expect(screen.getByText("Budget")).toBeInTheDocument();
    expect(screen.getByText("$100,000,000")).toBeInTheDocument();
  });

  it("renders revenue when greater than 0", () => {
    const movie = createMockMovie({
      revenue: 500000000,
    });

    render(<MovieAdditionalDetails movie={movie} />);

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$500,000,000")).toBeInTheDocument();
  });

  it("renders all details when available", () => {
    const movie = createMockMovie({
      budget: 100000000,
      revenue: 500000000,
      production_companies: [
        { id: 1, name: "Test Studio", logo_path: null, origin_country: "US" },
      ],
    });

    render(<MovieAdditionalDetails movie={movie} />);

    expect(screen.getByText("Additional Details")).toBeInTheDocument();
    expect(screen.getByText("Production Companies")).toBeInTheDocument();
    expect(screen.getByText("Test Studio")).toBeInTheDocument();
    expect(screen.getByText("Budget")).toBeInTheDocument();
    expect(screen.getByText("$100,000,000")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$500,000,000")).toBeInTheDocument();
  });
});
