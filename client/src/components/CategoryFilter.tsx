import { useState } from "react";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
}

const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
}: CategoryFilterProps) => {
  return (
    <section className="py-8 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Browse Categories</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div className="flex space-x-3 min-w-max">
            {CATEGORIES.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={
                  selectedCategory === category.id
                    ? "bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-light px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;
