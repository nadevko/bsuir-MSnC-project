import { useCsrfToken } from "~~/composables/useCsrfToken";

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return;

  const { getHeader } = useCsrfToken();

  const originalFetch = $fetch;

  // @ts-ignore
  globalThis.$fetch = (request, options: any = {}) => {
    options.headers = {
      ...(options.headers || {}),
      ...getHeader(),
    };

    return originalFetch(request, options);
  };
});
