import {useState, useMemo, useCallback} from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  itemsPerPage?: number;
}

export function usePagination({
  initialPage = 1,
  itemsPerPage = 16
}: UsePaginationOptions = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);

  const pagination = useMemo(() => ({
    currentPage,
    totalPages: Math.ceil(totalCount / itemsPerPage),
    offset: (currentPage - 1) * itemsPerPage,
    itemsPerPage,
    totalCount,
    hasNextPage: currentPage < Math.ceil(totalCount / itemsPerPage),
    hasPreviousPage: currentPage > 1
  }), [currentPage, totalCount, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  }, [pagination.totalPages]);

  const goToFirstPage = useCallback(() => setCurrentPage(1), []);
  const goToLastPage = useCallback(() => setCurrentPage(pagination.totalPages), [pagination.totalPages]);
  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const previousPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  return {
    ...pagination,
    setCurrentPage: goToPage,
    setTotalCount,
    goToFirstPage,
    goToLastPage,
    nextPage,
    previousPage
  };
}