import { GET } from "./route";
import { NextRequest } from "next/server";

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("/api/movies/[movieId]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return movie details for valid movie ID", async () => {
    const mockMovieData = {
      id: 550,
      title: "Fight Club",
      overview: "A ticking-time-bomb insomniac...",
      release_date: "1999-10-15",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovieData,
    } as Response);

    const request = new NextRequest("http://localhost:3377/api/movies/550");
    const response = await GET(request, { params: { movieId: "550" } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockMovieData);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/movie/550"),
      expect.any(Object)
    );
  });

  it("should return 400 for invalid movie ID", async () => {
    const request = new NextRequest("http://localhost:3377/api/movies/abc");
    const response = await GET(request, { params: { movieId: "abc" } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid movie ID");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should return 400 for negative movie ID", async () => {
    const request = new NextRequest("http://localhost:3377/api/movies/-1");
    const response = await GET(request, { params: { movieId: "-1" } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid movie ID");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should return 400 for zero movie ID", async () => {
    const request = new NextRequest("http://localhost:3377/api/movies/0");
    const response = await GET(request, { params: { movieId: "0" } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid movie ID");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should return 404 when movie not found", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    const request = new NextRequest("http://localhost:3377/api/movies/999999");
    const response = await GET(request, { params: { movieId: "999999" } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Movie not found");
  });

  it("should return 500 when TMDB API fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    const request = new NextRequest("http://localhost:3377/api/movies/550");
    const response = await GET(request, { params: { movieId: "550" } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to fetch movie details");
  });
});
