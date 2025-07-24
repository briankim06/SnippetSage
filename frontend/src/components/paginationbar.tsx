import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function PaginationBar({ currentPage, totalPages, onPageChange }: PaginationBarProps) {
    // Calculate the window of page numbers to display
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);
    if (endPage - startPage < 2) {
        startPage = Math.max(1, endPage - 2);
    }
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        aria-disabled={currentPage === 1}
                    />
                </PaginationItem>
                {startPage > 1 && (
                    <PaginationItem>
                        <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
                    </PaginationItem>
                )}
                {startPage > 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}
                {pageNumbers.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                {endPage < totalPages - 1 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}
                {endPage < totalPages && (
                    <PaginationItem>
                        <PaginationLink onClick={() => onPageChange(totalPages)}>{totalPages}</PaginationLink>
                    </PaginationItem>
                )}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        aria-disabled={currentPage === totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
  