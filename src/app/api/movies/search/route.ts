import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

export async function GET(request: NextRequest) {
  if (!TMDB_API_KEY || !TMDB_BASE_URL) {
    return NextResponse.json(
      { error: "TMDB API key / Base URL not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query");
  const page = searchParams.get("page") || "1";

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  const pageNum = parseInt(page, 10);
  if (isNaN(pageNum) || pageNum <= 0) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  const tmdbParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query: query.trim(),
    page: pageNum.toString(),
    include_adult: "false", // filter out adult content
  });

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?${tmdbParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 }, // cache for 5 mins
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching movies:", error);
    return NextResponse.json(
      { error: "Failed to search movies" },
      { status: 500 }
    );
  }
}
