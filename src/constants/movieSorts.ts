import { SortOption } from "@/types/sortOptions";

export interface SortOptionConfig {
  value: SortOption;
  label: string;
  field: "release_date" | "title" | "vote_average";
  direction: "asc" | "desc";
}

export const SORT_OPTIONS: Record<SortOption, SortOptionConfig> = {
  "release_date.asc": {
    value: "release_date.asc",
    label: "Release Date (Oldest First)",
    field: "release_date",
    direction: "asc",
  },
  "release_date.desc": {
    value: "release_date.desc",
    label: "Release Date (Newest First)",
    field: "release_date",
    direction: "desc",
  },
  "title.asc": {
    value: "title.asc",
    label: "Title (A-Z)",
    field: "title",
    direction: "asc",
  },
  "title.desc": {
    value: "title.desc",
    label: "Title (Z-A)",
    field: "title",
    direction: "desc",
  },
  "vote_average.asc": {
    value: "vote_average.asc",
    label: "Rating (Lowest First)",
    field: "vote_average",
    direction: "asc",
  },
  "vote_average.desc": {
    value: "vote_average.desc",
    label: "Rating (Highest First)",
    field: "vote_average",
    direction: "desc",
  },
};

export const SORT_OPTIONS_ARRAY = Object.values(SORT_OPTIONS);

export const DEFAULT_SORT: SortOption = "release_date.desc";
