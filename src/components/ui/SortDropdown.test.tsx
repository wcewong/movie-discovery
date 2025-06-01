import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SortDropdown from "./SortDropdown";
import { SortOption } from "@/types/sortOptions";

jest.mock("@/constants/movieSorts", () => ({
  SORT_OPTIONS_ARRAY: [
    {
      value: "release_date.desc",
      label: "Release Date (Newest First)",
      field: "release_date",
      direction: "desc",
    },
    {
      value: "vote_average.desc",
      label: "Rating (Highest First)",
      field: "vote_average",
      direction: "desc",
    },
    {
      value: "title.asc",
      label: "Title (A-Z)",
      field: "title",
      direction: "asc",
    },
  ],
}));

interface MockSortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

describe("SortDropdown", () => {
  const mockOnChange = jest.fn();
  const defaultProps: MockSortDropdownProps = {
    value: "release_date.desc" as SortOption,
    onChange: mockOnChange,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with selected value displayed", () => {
    render(<SortDropdown {...defaultProps} />);
    expect(screen.getByText("Release Date (Newest First)")).toBeInTheDocument();
  });

  it("shows dropdown arrow", () => {
    render(<SortDropdown {...defaultProps} />);
    const button = screen.getByRole("button");
    const arrow = button.querySelector("svg");
    expect(arrow).toBeInTheDocument();
  });

  it("opens dropdown when clicked", async () => {
    const user = userEvent.setup();
    render(<SortDropdown {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByText("Rating (Highest First)")).toBeInTheDocument();
    expect(screen.getByText("Title (A-Z)")).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SortDropdown {...defaultProps} />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    // open dropdown
    const button = screen.getByRole("button");
    await user.click(button);
    expect(screen.getByText("Rating (Highest First)")).toBeInTheDocument();

    // click outside
    await user.click(screen.getByTestId("outside"));
    expect(
      screen.queryByText("Rating (Highest First)")
    ).not.toBeInTheDocument();
  });

  it("closes dropdown when escape key is pressed", async () => {
    const user = userEvent.setup();
    render(<SortDropdown {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);
    expect(screen.getByText("Rating (Highest First)")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(
      screen.queryByText("Rating (Highest First)")
    ).not.toBeInTheDocument();
  });

  it("calls onChange when option is selected", async () => {
    const user = userEvent.setup();
    render(<SortDropdown {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    const option = screen.getByText("Rating (Highest First)");
    await user.click(option);

    expect(mockOnChange).toHaveBeenCalledWith("vote_average.desc");
  });

  it("closes dropdown after selecting an option", async () => {
    const user = userEvent.setup();
    render(<SortDropdown {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    const option = screen.getByText("Title (A-Z)");
    await user.click(option);

    expect(
      screen.queryByText("Rating (Highest First)")
    ).not.toBeInTheDocument();
  });

  it("shows checkmark for selected option", async () => {
    const user = userEvent.setup();
    render(<SortDropdown {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    const selectedOption = screen.getByRole("option", {
      name: /Release Date \(Newest First\)/,
    });
    const checkmark = selectedOption?.querySelector("svg");
    expect(checkmark).toBeInTheDocument();
  });

  it("applies correct ARIA attributes", () => {
    render(<SortDropdown {...defaultProps} />);
    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("aria-haspopup", "listbox");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("updates ARIA expanded when dropdown opens", async () => {
    const user = userEvent.setup();
    render(<SortDropdown {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
