import { ref, onBeforeUnmount } from "vue";

export function useCsrfToken() {
  const token = ref<string>("");

  function updateToken() {
    const match = document.cookie.match(/csrf-token=([^;]+)/);
    if (match && match[1]) {
      token.value = decodeURIComponent(match[1]);
    }
  }

  updateToken();

  const interval = setInterval(updateToken, 100);

  function getHeader(): Record<string, string> {
    if (!token.value) return {};
    return { "x-csrf-token": token.value };
  }

  onBeforeUnmount(() => {
    clearInterval(interval);
  });

  return { token, getHeader };
}
