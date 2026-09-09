// Sentry completely disabled for privacy / minimal metadata
export const Sentry = {
  captureException: (_err: any) => {},
  init: () => {},
}
