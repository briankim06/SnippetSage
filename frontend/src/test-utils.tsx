import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { ReactElement } from 'react'

export function renderWithProviders(ui: ReactElement) {
  const store = configureStore({
    reducer: { _dummy: (state = {}) => state },
  })
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  )
}

export * from '@testing-library/react' 