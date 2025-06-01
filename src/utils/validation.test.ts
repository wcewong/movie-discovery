import { isValidSortOption } from "./validation";

describe("isValidSortOption", () => {
  it("should return true for valid sort options", () => {
    expect(isValidSortOption("release_date.asc")).toBe(true);
    expect(isValidSortOption("release_date.desc")).toBe(true);
    expect(isValidSortOption("title.asc")).toBe(true);
    expect(isValidSortOption("title.desc")).toBe(true);
    expect(isValidSortOption("vote_average.asc")).toBe(true);
    expect(isValidSortOption("vote_average.desc")).toBe(true);
  });

  it("should return false for invalid sort options", () => {
    expect(isValidSortOption("invalid_sort")).toBe(false);
    expect(isValidSortOption("release_date")).toBe(false);
    expect(isValidSortOption("title.invalid")).toBe(false);
    expect(isValidSortOption("vote_average.wrong")).toBe(false);
    expect(isValidSortOption("popularity.desc")).toBe(false);
  });

  it("should return false for null or empty values", () => {
    expect(isValidSortOption(null)).toBe(false);
    expect(isValidSortOption("")).toBe(false);
    expect(isValidSortOption("   ")).toBe(false);
  });
});
