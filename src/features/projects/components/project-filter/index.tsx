"use client";

import { useState } from "react";
import { CATEGORY_OPTIONS, PROJECT_CATEGORIES } from "~/constant/project";
import type { TProjectCategory } from "~/types";
import Each from "~/_components/each";
import { Button } from "~/_components/ui/button";
import AnimateItem from "~/_components/animate-item";
import { cn } from "~/lib/cn";

interface ProjectFilterProps {
  onFilterChange: (categories: TProjectCategory[]) => void;
}

export default function ProjectFilter({ onFilterChange }: ProjectFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<
    TProjectCategory[]
  >([]);

  const toggleCategory = (category: TProjectCategory) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    onFilterChange([]);
  };

  return (
    <AnimateItem className="flex flex-col gap-4">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Filter by Category
        </h3>
        {selectedCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto p-0 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2">
        <Each
          of={CATEGORY_OPTIONS}
          render={(option) => {
            const isSelected = selectedCategories.includes(option.value);
            const categoryConfig = PROJECT_CATEGORIES[option.value];

            return (
              <Button
                key={option.value}
                onClick={() => toggleCategory(option.value)}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                  "transition-all duration-200",
                  isSelected && "ring-2 ring-primary ring-offset-1",
                )}
              >
                {option.label}
              </Button>
            );
          }}
        />
      </div>

      {/* Active Filters Display */}
      {selectedCategories.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {selectedCategories.length}
          </span>{" "}
          filter{selectedCategories.length > 1 ? "s" : ""} applied
        </div>
      )}
    </AnimateItem>
  );
}
