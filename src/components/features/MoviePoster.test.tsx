import { render, screen } from "@testing-library/react";
import { MoviePoster } from "./MoviePoster";

describe("MoviePoster", () => {
  const defaultProps = {
    title: "Test Movie",
    voteAverage: 8.5,
    voteCount: 1234,
  };

  it("renders movie poster image when posterPath is provided", () => {
    render(<MoviePoster {...defaultProps} posterPath="/test-poster.jpg" />);

    const image = screen.getByRole("img", { name: "Test Movie" });
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("/test-poster.jpg")
    );
    expect(image).toHaveAttribute("alt", "Test Movie");
  });

  it("renders fallback when no poster path is provided", () => {
    render(<MoviePoster {...defaultProps} />);

    expect(screen.getByText("🎬")).toBeInTheDocument();
    expect(screen.getByText("No Poster")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("displays vote average with one decimal place", () => {
    render(<MoviePoster {...defaultProps} voteAverage={8.567} />);
    expect(screen.getByText("8.6")).toBeInTheDocument();
  });

  it("displays formatted vote count", () => {
    render(<MoviePoster {...defaultProps} voteCount={1234567} />);
    expect(screen.getByText("1,234,567 votes")).toBeInTheDocument();
  });

  it("displays star emoji in rating badge", () => {
    render(<MoviePoster {...defaultProps} />);
    expect(screen.getByText("⭐")).toBeInTheDocument();
  });
});
