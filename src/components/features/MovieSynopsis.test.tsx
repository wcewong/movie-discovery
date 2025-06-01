import { render, screen } from "@testing-library/react";
import { MovieSynopsis } from "./MovieSynopsis";

describe("MovieSynopsis", () => {
  it("renders synopsis heading", () => {
    render(<MovieSynopsis overview="Test overview" />);
    expect(
      screen.getByRole("heading", { name: "Synopsis" })
    ).toBeInTheDocument();
  });

  it("renders overview when provided", () => {
    const overview = "This is a test movie overview with some details.";
    render(<MovieSynopsis overview={overview} />);
    expect(screen.getByText(overview)).toBeInTheDocument();
  });

  it("renders fallback message when no overview is provided", () => {
    render(<MovieSynopsis />);
    expect(screen.getByText("No synopsis available.")).toBeInTheDocument();
  });

  it("renders fallback message when overview is empty string", () => {
    render(<MovieSynopsis overview="" />);
    expect(screen.getByText("No synopsis available.")).toBeInTheDocument();
  });
});
