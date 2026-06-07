import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../../test/renderWithProviders';
import { HeroSection } from './HeroSection';

const emojiPattern = /\p{Extended_Pictographic}/u;

describe('HeroSection', () => {
  it('renders the public value proposition with an accessible primary CTA', () => {
    renderWithProviders(<HeroSection />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /run your tournament predictions before kickoff/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create a league/i }),
    ).toBeInTheDocument();
  });

  it('renders text without emojis and exposes keyboard focus on the CTA', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<HeroSection />);

    expect(container.textContent).not.toMatch(emojiPattern);

    await user.tab();

    expect(
      screen.getByRole('button', { name: /create a league/i }),
    ).toHaveFocus();
  });
});
