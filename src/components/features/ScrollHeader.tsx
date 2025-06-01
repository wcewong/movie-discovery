"use client";

import { useState, useEffect } from "react";
import SortDropdown from "@/components/ui/SortDropdown";
import { SortOption } from "@/types/sortOptions";

interface ScrollHeaderProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

export default function ScrollHeader({
  sortBy,
  onSortChange,
}: ScrollHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md transition-transform duration-300 ease-in-out h-20 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 h-full">
        <button
          onClick={handleLogoClick}
          className="font-bold text-xl text-black flex-shrink-0 hover:text-blue-600 transition-colors cursor-pointer"
        >
          LOGO
        </button>

        <div className="flex items-center space-x-4">
          <nav className="transition-opacity duration-300"></nav>

          <SortDropdown
            value={sortBy}
            onChange={onSortChange}
            className="flex-shrink-0"
          />
        </div>
      </div>
    </header>
  );
}
