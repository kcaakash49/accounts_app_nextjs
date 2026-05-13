"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  changePage: (page: number) => void; // Optional callback for page change
}

export default function Pagination({ totalPages, currentPage,changePage }: PaginationProps) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showMax = 5; 

    if (totalPages <= showMax + 2) {
      // If total pages are low, just show all
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4 mt-20">
      <div className="flex items-center gap-1 md:gap-2">
        {/* Previous */}
        <button
          disabled={currentPage <= 1}
          onClick={() => changePage(currentPage - 1)}
          className="p-2 md:p-3 rounded-xl border border-secondary-200 disabled:opacity-20 hover:border-gold hover:text-gold transition-all text-blue-500"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dynamic Page Numbers */}
        <div className="flex items-center gap-1 md:gap-2">
          {pageNumbers.map((p, index) => {
            if (p === "...") {
              return (
                <span key={`dots-${index}`} className="px-2 text-secondary-400">
                  <MoreHorizontal size={16} />
                </span>
              );
            }

            return (
              <button
                key={p}
                onClick={() => changePage(p as number)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-bold text-sm transition-all border ${
                  currentPage === p
                    ? "bg-blue-200 text-black border-transparent shadow-lg scale-110"
                    : "text-secondary-600  border-secondary-200 hover:border-gold"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => changePage (currentPage + 1)}
          className="p-2 md:p-3 rounded-xl border border-secondary-200 dark:border-secondary-700 disabled:opacity-20 hover:border-gold hover:text-gold transition-all text-blue-500"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Page Indicator for Mobile Clarity */}
      <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}