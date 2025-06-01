import { apiClient, movieApi } from "./api-client";

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// mock window.location.origin
Object.defineProperty(window, "location", {
  value: {
    origin: "http://localhost:3377",
  },
  writable: true,
});

describe("APIClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMovies", () => {
    it("should fetch movies with correct URL and parameters", async () => {
      const mockResponse = {
        page: 1,
        results: [{ id: 1, title: "Test Movie" }],
        total_pages: 10,
        total_results: 100,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await apiClient.getMovies({
        sortBy: "vote_average.desc",
        page: 2,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3377/api/movies/discover?sort_by=vote_average.desc&page=2"
      );
      expect(result).toEqual(mockResponse);
    });

    it("should use default page when not provided", async () => {
      const mockResponse = { page: 1, results: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await apiClient.getMovies({ sortBy: "release_date.desc" });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3377/api/movies/discover?sort_by=release_date.desc&page=1"
      );
    });

    it("should handle all valid sort options", async () => {
      const mockResponse = { page: 1, results: [] };
      const sortOptions = [
        "release_date.asc",
        "release_date.desc",
        "title.asc",
        "title.desc",
        "vote_average.asc",
        "vote_average.desc",
      ];

      for (const sortBy of sortOptions) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as Response);

        await apiClient.getMovies({ sortBy: sortBy as any });

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(`sort_by=${sortBy}`)
        );
      }
    });
  });

  describe("getMovieDetail", () => {
    it("should fetch movie details with correct URL", async () => {
      const mockMovie = {
        id: 550,
        title: "Fight Club",
        overview: "Great movie",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMovie,
      } as Response);

      const result = await apiClient.getMovieDetail(550);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3377/api/movies/550"
      );
      expect(result).toEqual(mockMovie);
    });

    it("should handle different movie IDs", async () => {
      const mockMovie = { id: 123, title: "Test" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMovie,
      } as Response);

      await apiClient.getMovieDetail(123);

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3377/api/movies/123"
      );
    });
  });

  describe("error handling", () => {
    it("should throw error when response is not ok", async () => {
      const errorResponse = { error: "Movie not found" };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => errorResponse,
      } as Response);

      await expect(apiClient.getMovieDetail(999999)).rejects.toThrow(
        "API Error: 404 Movie not found"
      );
    });

    it("should handle error when response.json() fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      await expect(apiClient.getMovieDetail(123)).rejects.toThrow(
        "API Error: 500 Internal Server Error"
      );
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(
        apiClient.getMovies({ sortBy: "release_date.desc" })
      ).rejects.toThrow("Network error");
    });
  });

  describe("URL construction", () => {
    it("should use environment variable for base URL", () => {
      // test that constructor uses the environment variable
      expect(apiClient["baseURL"]).toBe("/api"); // Default fallback
    });

    it("should construct URLs correctly with base URL", async () => {
      const mockResponse = { page: 1, results: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await apiClient.getMovies({ sortBy: "title.asc" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(
          /^http:\/\/localhost:3377\/api\/movies\/discover\?/
        )
      );
    });
  });
});

describe("movieApi exports", () => {
  it("should export bound methods that work correctly", async () => {
    const mockResponse = { page: 1, results: [] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    // Test that destructured methods work (this tests the .bind() calls)
    const { getMovies } = movieApi;
    const result = await getMovies({ sortBy: "release_date.desc" });

    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/movies/discover")
    );
  });

  it("should have all expected methods in movieApi", () => {
    expect(movieApi).toHaveProperty("getMovies");
    expect(movieApi).toHaveProperty("getMovieDetail");

    expect(typeof movieApi.getMovies).toBe("function");
    expect(typeof movieApi.getMovieDetail).toBe("function");
  });
});
