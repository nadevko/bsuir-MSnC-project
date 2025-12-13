export default defineNuxtPlugin(async () => {
    const csrfCookie = useCookie('csrf-token');

    if (!csrfCookie.value) {
        try {
            await $fetch('/api/csrf');
        } catch (e) {
        }
    }
});