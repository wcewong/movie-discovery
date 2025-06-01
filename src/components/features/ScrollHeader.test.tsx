import { render, screen, fireEvent } from "@testing-library/react";
import ScrollHeader from "./ScrollHeader";
import { SortOption } from "@/types/sortOptions";

jest.mock("@/components/ui/SortDropdown", () => {
  interface MockSortDropdownProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
    className?: string;
  }

  return function MockSortDropdown({ value, onChange }: MockSortDropdownProps) {
    return (
      <div data-testid="sort-dropdown">
        <span>Sort: {value}</span>
        <button onClick={() => onChange("title.asc" as SortOption)}>
          Change Sort
        </button>
      </div>
    );
  };
});

// window.scrollY
Object.defineProperty(window, "scrollY", {
  writable: true,
  value: 0,
});

interface ScrollHeaderProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

describe("ScrollHeader", () => {
  const mockOnSortChange = jest.fn();
  const defaultProps: ScrollHeaderProps = {
    sortBy: "release_date.desc" as SortOption,
    onSortChange: mockOnSortChange,
  };

  beforeEach(() => {
    mockOnSortChange.mockClear();
    window.scrollY = 0;
  });

  it("renders logo and sort dropdown", () => {
    render(<ScrollHeader {...defaultProps} />);

    expect(screen.getByText("LOGO")).toBeInTheDocument();
    expect(screen.getByTestId("sort-dropdown")).toBeInTheDocument();
  });

  it("passes correct props to SortDropdown", () => {
    render(<ScrollHeader {...defaultProps} />);

    expect(screen.getByText("Sort: release_date.desc")).toBeInTheDocument();
  });

  it("calls onSortChange when sort dropdown changes", () => {
    render(<ScrollHeader {...defaultProps} />);

    const changeSortButton = screen.getByText("Change Sort");
    fireEvent.click(changeSortButton);

    expect(mockOnSortChange).toHaveBeenCalledWith("title.asc");
  });

  it("starts visible by default", () => {
    render(<ScrollHeader {...defaultProps} />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("translate-y-0");
    expect(header).not.toHaveClass("-translate-y-full");
  });

  it("hides when scrolling down", () => {
    render(<ScrollHeader {...defaultProps} />);
    const header = screen.getByRole("banner");

    // simulate scrolling down
    window.scrollY = 100;
    fireEvent.scroll(window);

    expect(header).toHaveClass("-translate-y-full");
  });

  it("shows when scrolling up", () => {
    render(<ScrollHeader {...defaultProps} />);
    const header = screen.getByRole("banner");

    // first scroll down
    window.scrollY = 100;
    fireEvent.scroll(window);
    expect(header).toHaveClass("-translate-y-full");

    // then scroll up
    window.scrollY = 50;
    fireEvent.scroll(window);
    expect(header).toHaveClass("translate-y-0");
  });

  it("does not hide when scroll position is less than 50px", () => {
    render(<ScrollHeader {...defaultProps} />);
    const header = screen.getByRole("banner");

    // simulate small scroll
    window.scrollY = 30;
    fireEvent.scroll(window);

    expect(header).toHaveClass("translate-y-0");
  });

  it("has correct CSS classes for styling", () => {
    render(<ScrollHeader {...defaultProps} />);
    const header = screen.getByRole("banner");

    expect(header).toHaveClass(
      "fixed",
      "top-0",
      "left-0",
      "right-0",
      "z-50",
      "bg-white",
      "shadow-md",
      "transition-transform",
      "duration-300",
      "ease-in-out",
      "h-20"
    );
  });

  it("has proper layout structure", () => {
    render(<ScrollHeader {...defaultProps} />);

    const header = screen.getByRole("banner");
    const container = header.firstChild;

    expect(container).toHaveClass(
      "flex",
      "items-center",
      "justify-between",
      "px-6",
      "h-full"
    );
  });
});
