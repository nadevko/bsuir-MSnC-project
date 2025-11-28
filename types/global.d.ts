declare global {
  var __sessionsCleanupInterval: ReturnType<typeof setInterval> | undefined;
}

export {};
