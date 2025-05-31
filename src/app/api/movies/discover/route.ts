import { DEFAULT_SORT } from "@/constants/movieSorts";
import { isValidSortOption } from "@/utils/validation";
import { SortOption } from "@/types/sortOptions";
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

  const page = searchParams.get("page") || "1";
  const sortByParam = searchParams.get("sort_by");

  const sortBy: SortOption = isValidSortOption(sortByParam)
    ? sortByParam
    : DEFAULT_SORT;

  const tmdbParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    page,
    sort_by: sortBy,
  });

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?${tmdbParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 600 }, // cache for 10 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error discovering movies:", error);
    return NextResponse.json(
      { error: "Failed to discover movies" },
      { status: 500 }
    );
  }
}
