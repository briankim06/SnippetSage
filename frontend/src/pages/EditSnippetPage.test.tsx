import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, screen, waitFor } from '@/test-utils';
import EditSnippetPage from './EditSnippetPage';

// -- Mock react-router-dom helpers we rely on ------------
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '123' }),
  };
});

// -- Mock toast library ----------------------------------
const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock('sonner', () => ({
  toast: {
    success: toastSuccess,
    error: toastError,
  },
}));

// -- Prepare RTK Query hooks -----------------------------
const mockUpdateSnippet = vi.fn();
const mockSnippet = {
  _id: '123',
  userId: 'user1',
  title: 'My snippet',
  code: 'console.log("hello")',
  language: 'javascript',
  framework: 'react',
  tags: ['tag1'],
  summary: 'A cool snippet',
  createdAt: new Date(),
  updatedAt: new Date(),
};

vi.mock('@/store/slices/api/snippetApi', () => ({
  useUpdateSnippetMutation: () => [mockUpdateSnippet, { isLoading: false }],
  useGetOneSnippetQuery: () => ({ data: mockSnippet }),
}));

// -- Helper to render component --------------------------
import { renderWithProviders } from '@/test-utils';

// --------------------------------------------------------

describe('EditSnippetPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('populates form with existing snippet and updates successfully', async () => {
    mockUpdateSnippet.mockResolvedValueOnce({});

    renderWithProviders(<EditSnippetPage />);

    // Title input should contain initial value
    const titleInput = screen.getByPlaceholderText(/enter snippet title/i) as HTMLInputElement;
    expect(titleInput.value).toBe(mockSnippet.title);

    // Modify title
    fireEvent.change(titleInput, { target: { value: 'Updated title' } });

    // Submit the form (button has text UPDATE)
    const submitBtn = screen.getByRole('button', { name: /update/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdateSnippet).toHaveBeenCalledTimes(1);
    });

    // Expect payload to include trimmed summary
    const expectedPayload = {
      id: '123',
      title: 'Updated title',
      code: mockSnippet.code,
      tags: mockSnippet.tags,
      language: mockSnippet.language,
      framework: mockSnippet.framework,
      summary: mockSnippet.summary.trim(),
    };
    expect(mockUpdateSnippet).toHaveBeenCalledWith(expectedPayload);

    expect(toastSuccess).toHaveBeenCalledWith('Snippet updated successfully');
  });

  it('shows error toast on update failure', async () => {
    mockUpdateSnippet.mockRejectedValueOnce(new Error('Failed'));

    renderWithProviders(<EditSnippetPage />);

    const submitBtn = screen.getByRole('button', { name: /update/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockUpdateSnippet).toHaveBeenCalled();
      expect(toastError).toHaveBeenCalledWith('Failed to update snippet');
    });
  });
}); 