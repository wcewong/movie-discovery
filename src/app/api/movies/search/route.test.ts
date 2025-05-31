import { GET } from "./route";
import { NextRequest } from "next/server";

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("/api/movies/search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return search results for valid query", async () => {
    const mockSearchData = {
      page: 1,
      results: [
        { id: 550, title: "Fight Club" },
        { id: 551, title: "Fight Club 2" },
      ],
      total_pages: 1,
      total_results: 2,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSearchData,
    } as Response);

    const request = new NextRequest(
      "http://localhost:3377/api/movies/search?query=fight%20club"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockSearchData);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/search/movie"),
      expect.any(Object)
    );
  });

  it("should return 400 for missing query", async () => {
    const request = new NextRequest("http://localhost:3377/api/movies/search");
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Search query is required");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should return 400 for empty query", async () => {
    const request = new NextRequest(
      "http://localhost:3377/api/movies/search?query="
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Search query is required");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should return 400 for whitespace-only query", async () => {
    const request = new NextRequest(
      "http://localhost:3377/api/movies/search?query=%20%20%20"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Search query is required");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should handle pagination correctly", async () => {
    const mockSearchData = {
      page: 2,
      results: [],
      total_pages: 5,
      total_results: 100,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSearchData,
    } as Response);

    const request = new NextRequest(
      "http://localhost:3377/api/movies/search?query=batman&page=2"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.page).toBe(2);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("page=2"),
      expect.any(Object)
    );
  });

  it("should return 400 for invalid page number", async () => {
    const request = new NextRequest(
      "http://localhost:3377/api/movies/search?query=test&page=abc"
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid page number");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should trim whitespace from query", async () => {
    const mockSearchData = { page: 1, results: [] };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSearchData,
    } as Response);

    const request = new NextRequest(
      "http://localhost:3377/api/movies/search?query=%20%20transformers%20%20"
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("query=transformers"),
      expect.any(Object)
    );
  });
});
