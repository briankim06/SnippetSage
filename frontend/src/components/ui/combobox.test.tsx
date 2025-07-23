import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Combobox } from './combobox'

describe('Combobox', () => {
  const options = [
    { value: 'js', label: 'JavaScript' },
    { value: 'py', label: 'Python' },
  ]
  it('selects an option and updates trigger label', async () => {
    render(<Combobox options={options} placeholder="Select language" />)
    const trigger = screen.getByRole('combobox')
    await userEvent.click(trigger)
    await userEvent.click(screen.getByText('Python'))
    expect(trigger).toHaveTextContent('Python')
  })
}) 