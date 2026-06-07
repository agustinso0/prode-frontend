import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders primary and ghost variants as accessible buttons', () => {
    render(
      <div>
        <Button variant="primary">Create a league</Button>
        <Button variant="ghost" size="sm">
          View matches
        </Button>
      </div>,
    );

    expect(
      screen.getByRole('button', { name: 'Create a league' }),
    ).toBeEnabled();
    expect(screen.getByRole('button', { name: 'View matches' })).toBeEnabled();
  });

  it('is keyboard-reachable', async () => {
    const user = userEvent.setup();

    render(<Button>Join tournament</Button>);

    await user.tab();

    expect(
      screen.getByRole('button', { name: 'Join tournament' }),
    ).toHaveFocus();
  });
});
