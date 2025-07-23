import { renderWithProviders, screen, fireEvent } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import SnippetSandBoxPage from './SnippetSandboxPage'
import { vi } from 'vitest'

// Mock RTK query hook
const createSnippetMock = vi.fn(() => ({ unwrap: vi.fn().mockResolvedValue({}) }))
vi.mock('@/store/slices/api/snippetApi', () => ({
  useCreateSnippetMutation: () => [createSnippetMock, { isLoading: false }],
}))

describe('SnippetSandBoxPage', () => {
  it('adds and removes tags correctly', async () => {
    renderWithProviders(<SnippetSandBoxPage />)
    const input = screen.getByPlaceholderText(/add tag/i)
    await userEvent.type(input, 'test{enter}')
    expect(screen.getByText('test')).toBeInTheDocument()
    await userEvent.click(screen.getByText('×'))
    expect(screen.queryByText('test')).not.toBeInTheDocument()
  })

  it('submits form with required fields and calls mutation', async () => {
    renderWithProviders(<SnippetSandBoxPage />)

    await userEvent.type(
      screen.getByPlaceholderText(/enter snippet title/i),
      'Hello'
    )
    await userEvent.type(
      screen.getByPlaceholderText(/paste your code here/i),
      'print("hi")'
    )
    // add a tag
    await userEvent.type(screen.getByPlaceholderText(/add tag/i), 'unit{enter}')

    await userEvent.click(screen.getByRole('button', { name: /create snippet/i }))

    expect(createSnippetMock).toHaveBeenCalledWith({
      title: 'Hello',
      code: 'print("hi")',
      tags: ['unit'],
      language: '',
      framework: '',
      summary: '',
    })
  })
}) 