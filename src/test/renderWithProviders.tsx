import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, type ReactElement } from 'react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { render, type RenderOptions } from '@testing-library/react';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

type RouterOptions = Pick<MemoryRouterProps, 'initialEntries' | 'initialIndex'>;

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  queryClient?: QueryClient;
  router?: RouterOptions;
};

export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    router = { initialEntries: ['/'] },
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  function Providers({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter {...router}>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Providers, ...renderOptions }),
  };
}
