/**
 * Premium is always unlocked in this build.
 * No network calls to Lemon Squeezy or license servers.
 */
export function usePremium() {
  return {
    activated: true as boolean,
    isLoading: false,
    error: undefined as string | undefined,
  }
}
