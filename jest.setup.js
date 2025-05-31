process.env.TMDB_API_KEY = "test-api-key";
process.env.TMDB_BASE_URL = "https://api.themoviedb.org/3";

global.fetch = jest.fn();

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options = {}) => {
      const response = {
        json: async () => data,
        status: options.status || 200,
        ok: (options.status || 200) >= 200 && (options.status || 200) < 300,
      };
      return response;
    }),
  },
  NextRequest: class MockNextRequest {
    constructor(url) {
      this.url = url;
    }
  },
}));
