import { GET } from "./route";
import { NextRequest } from "next/server";

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("/api/movies/discover", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return movies with default sort when no params provided", async () => {
    const mockMoviesData = {
      page: 1,
      results: [
        { id: 550, title: "Fight Club" },
        { id: 551, title: "Another Movie" },
      ],
      total_pages: 100,
      total_results: 2000,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMoviesData,
    } as Response);

    const request = new NextRequest(
      "http://localhost:3377/api/movies/discover"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockMoviesData);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/discover/movie"),
      expect.any(Object)
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("sort_by=release_date.desc"), // DEFAULT_SORT
      expect.any(Object)
    );
  });

  it("should use valid sort option when provided", async () => {
    const mockMoviesData = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMoviesData,
    } as Response);

    const request = new NextRequest(
      "http://localhost:3377/api/movies/discover?sort_by=vote_average.desc"
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("sort_by=vote_average.desc"),
      expect.any(Object)
    );
  });

  it("should fallback to default sort when invalid sort option provided", async () => {
    const mockMoviesData = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMoviesData,
    } as Response);

    const request = new NextRequest(
      "http://localhost:3377/api/movies/discover?sort_by=invalid_sort"
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("sort_by=release_date.desc"), // should fallback to DEFAULT_SORT
      expect.any(Object)
    );
  });

  it("should handle pagination correctly", async () => {
    const mockMoviesData = {
      page: 3,
      results: [],
      total_pages: 100,
      total_results: 2000,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMoviesData,
    } as Response);

    const request = new NextRequest(
      "http://localhost:3377/api/movies/discover?page=3&sort_by=title.asc"
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("page=3"),
      expect.any(Object)
    );
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("sort_by=title.asc"),
      expect.any(Object)
    );
  });

  it("should include API key in request", async () => {
    const mockMoviesData = { page: 1, results: [] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMoviesData,
    } as Response);

    const request = new NextRequest(
      "http://localhost:3377/api/movies/discover"
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("api_key=test-api-key"),
      expect.any(Object)
    );
  });

  it("should return 500 when TMDB API fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const request = new NextRequest(
      "http://localhost:3377/api/movies/discover"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to discover movies");
  });

  it("should return 500 when fetch throws an error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const request = new NextRequest(
      "http://localhost:3377/api/movies/discover"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to discover movies");
  });

  it("should test all valid sort options", async () => {
    const validSortOptions = [
      "release_date.asc",
      "release_date.desc",
      "title.asc",
      "title.desc",
      "vote_average.asc",
      "vote_average.desc",
    ];

    const mockMoviesData = { page: 1, results: [] };

    for (const sortOption of validSortOptions) {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMoviesData,
      } as Response);

      const request = new NextRequest(
        `http://localhost:3377/api/movies/discover?sort_by=${sortOption}`
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`sort_by=${sortOption}`),
        expect.any(Object)
      );
    }
  });

  it("should handle missing page parameter (defaults to 1)", async () => {
    const mockMoviesData = { page: 1, results: [] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMoviesData,
    } as Response);

    const request = new NextRequest(
      "http://localhost:3377/api/movies/discover?sort_by=title.asc"
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("page=1"),
      expect.any(Object)
    );
  });

  it("should include correct headers in fetch request", async () => {
    const mockMoviesData = { page: 1, results: [] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMoviesData,
    } as Response);

    const request = new NextRequest(
      "http://localhost:3377/api/movies/discover"
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 600 },
      })
    );
  });
});
