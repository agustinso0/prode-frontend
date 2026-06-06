import { z } from 'zod';

const browserEnvSchema = z.object({
  VITE_PRODE_API_BASE_URL: z.string().trim().default('').refine(isApiBaseUrl, {
    message:
      'VITE_PRODE_API_BASE_URL must be empty, an absolute http(s) URL, or a root-relative path.',
  }),
});

function isApiBaseUrl(value: string) {
  if (value === '') {
    return true;
  }

  if (value.startsWith('/') && !value.startsWith('//')) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const env = browserEnvSchema.parse(import.meta.env);

export type BrowserEnv = z.infer<typeof browserEnvSchema>;
