import { SortOption } from "@/types/sortOptions";
import { SORT_OPTIONS } from "@/constants/movieSorts";

export function isValidSortOption(sort: string | null): sort is SortOption {
  if (!sort) return false;
  return sort in SORT_OPTIONS;
}
