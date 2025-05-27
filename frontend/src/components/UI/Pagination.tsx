import {ArrowLeft, ArrowRight} from 'lucide-react';

interface PaginationProps {
    currentPage: number;             // Current active page (1-based index)
    totalPages: number;              // Total number of pages available
    onPageChange: (page: number) => void; // Callback triggered when user selects a different page
    maxPagesToShow?: number;         // Maximum number of page buttons to display (default 5)
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       onPageChange,
                                       maxPagesToShow = 5,
                                   }: PaginationProps) {

    if (totalPages === 0) return null;

    // Calculate the start page number for pagination buttons,
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    // Adjust if endPage goes beyond totalPages
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Generate array of page numbers to render buttons for
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        // Navigation container with ARIA label for accessibility
        <nav className="flex justify-center items-center gap-2" aria-label="Pagination">
            {/* Previous page button, only show if not on first page */}
            {currentPage > 1 && (
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    className="px-4 py-2 rounded border border-green-600 text-green-600 hover:bg-green-500 hover:text-white transition"
                    aria-label="Previous page"
                >
                    <ArrowLeft size={18}/>
                </button>
            )}

            {/* First page button and leading ellipsis if starting page is greater than 1 */}
            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-4 py-2 rounded border border-green-600 text-green-600 hover:bg-green-500 hover:text-white transition"
                        aria-label="Page 1"
                    >
                        1
                    </button>
                    {/* Show ellipsis if gap between first page and startPage is more than one */}
                    {startPage > 2 && <span className="px-2">...</span>}
                </>
            )}

            {/* Render buttons for pages within the calculated range */}
            {totalPages > 1 &&
                pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded border border-green-600 cursor-pointer transition ${
                            page === currentPage
                                ? 'bg-green-600 text-white'   // Highlight current page
                                : 'text-green-600 hover:bg-green-500 hover:text-white'
                        }`}
                        aria-current={page === currentPage ? 'page' : undefined} // ARIA attribute for current page
                        aria-label={`Page ${page}`}
                    >
                        {page}
                    </button>
                ))}

            {/* Trailing ellipsis and last page button if endPage is less than totalPages */}
            {endPage < totalPages && (
                <>
                    {/* Show ellipsis if gap between endPage and last page is more than one */}
                    {endPage < totalPages - 1 && <span className="px-2">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-4 py-2 rounded border border-green-600 text-green-600 hover:bg-green-500 hover:text-white transition"
                        aria-label={`Page ${totalPages}`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next page button, only show if not on last page */}
            {currentPage < totalPages && (
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    className="px-4 py-2 rounded border border-green-600 text-green-600 hover:bg-green-500 hover:text-white transition"
                    aria-label="Next page"
                >
                    <ArrowRight size={18}/>
                </button>
            )}
        </nav>
    );
}
