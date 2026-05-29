import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onPageChange?: (page: number) => void;
}

function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-0 py-4">
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => onPageChange?.(1)}
          disabled={page <= 1}
          className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40"
        >
          <FiChevronsLeft size={16} />
        </button>

        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40"
        >
          <FiChevronLeft size={16} />
        </button>

        {pageNumbers.map((pageNum, idx) =>
          pageNum === "..." ? (
            <span key={`dots-${idx}`} className="hidden sm:inline px-1 text-sm text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange?.(pageNum as number)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
                pageNum === page
                  ? "bg-[#0059FF] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {pageNum}
            </button>
          ),
        )}

        <button
          onClick={onNext}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40"
        >
          <FiChevronRight size={16} />
        </button>

        <button
          onClick={() => onPageChange?.(totalPages)}
          disabled={page >= totalPages}
          className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40"
        >
          <FiChevronsRight size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Page</span>
        <span className="font-medium text-slate-800">{page}</span>
        <span>of {totalPages}</span>
      </div>
    </div>
  );
}

export default Pagination;
