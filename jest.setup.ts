import "@testing-library/jest-dom";

process.env.TMDB_API_KEY = "test-api-key";
process.env.TMDB_BASE_URL = "https://api.themoviedb.org/3";

global.fetch = jest.fn();

// for API route testing
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
    public url: string;

    constructor(url: string) {
      this.url = url;
    }
  },
}));

// for infinite scroll tests
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor() {}
  disconnect(): void {}
  observe(): void {}
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
