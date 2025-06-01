import { NextRequest, NextResponse } from "next/server";
import { buildTMDBUrl, TMDB_ENDPOINTS } from "@/constants/apiEndpoints";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

interface MovieDetailsParams {
  params: Promise<{
    movieId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: MovieDetailsParams
) {
  if (!TMDB_API_KEY || !TMDB_BASE_URL) {
    return NextResponse.json(
      { error: "TMDB API key / Base URL not configured" },
      { status: 500 }
    );
  }

  const { movieId } = await params;
  const movieIdNum = parseInt(movieId, 10);
  if (!movieId || isNaN(movieIdNum) || movieIdNum <= 0) {
    return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
  }

  const tmdbParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
  });

  try {
    const endpoint = TMDB_ENDPOINTS.MOVIE_DETAIL(movieIdNum);
    const url = buildTMDBUrl(endpoint, TMDB_BASE_URL);

    const response = await fetch(`${url}?${tmdbParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 1800 }, // cache for 30 mins
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Movie not found" }, { status: 404 });
      }
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie details" },
      { status: 500 }
    );
  }
}
