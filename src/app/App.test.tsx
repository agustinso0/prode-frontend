import { render, screen } from '@testing-library/react';

import { App } from './App';

describe('App', () => {
  it('renders the foundation shell through the route tree', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: /tournament predictions for private leagues/i,
      }),
    ).toBeInTheDocument();
  });
});
