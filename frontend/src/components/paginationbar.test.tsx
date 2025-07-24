import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PaginationBar } from './paginationbar';

describe('PaginationBar', () => {
    const defaultProps = {
        currentPage: 5,
        totalPages: 10,
        onPageChange: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly with given props', () => {
        render(<PaginationBar {...defaultProps} />);
        
        const activeLink = screen.getByText('5');
        expect(activeLink).toBeInTheDocument();
        expect(activeLink).toHaveAttribute('aria-current', 'page');

        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('calls onPageChange with the correct page number when a page link is clicked', () => {
        const onPageChange = vi.fn();
        render(<PaginationBar {...defaultProps} onPageChange={onPageChange} />);
        
        fireEvent.click(screen.getByText('6'));
        expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it('calls onPageChange for previous and next buttons', () => {
        const onPageChange = vi.fn();
        render(<PaginationBar {...defaultProps} onPageChange={onPageChange} />);
        
        fireEvent.click(screen.getByText('Next').closest('a')!);
        expect(onPageChange).toHaveBeenCalledWith(6);

        fireEvent.click(screen.getByText('Previous').closest('a')!);
        expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('disables the "Previous" button on the first page', () => {
        render(<PaginationBar {...defaultProps} currentPage={1} />);
        const prevButton = screen.getByText('Previous').closest('a');
        expect(prevButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('disables the "Next" button on the last page', () => {
        render(<PaginationBar {...defaultProps} currentPage={10} />);
        const nextButton = screen.getByText('Next').closest('a');
        expect(nextButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('renders ellipsis and first/last page links correctly for large ranges', () => {
        render(<PaginationBar {...defaultProps} currentPage={5} totalPages={20} />);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getAllByText('More pages')).toHaveLength(2);
        expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('does not render ellipsis when not needed', () => {
        render(<PaginationBar {...defaultProps} currentPage={2} totalPages={4} />);
        expect(screen.queryByText('More pages')).not.toBeInTheDocument();
    });
}); 