/**
 * Lemon Squeezy license API stubbed out.
 * No network requests are made.
 */

async function activateLicense(_key: string, _instanceName: string) {
  return 'local-unlocked'
}

async function deactivateLicense(_key: string, _instanceId: string) {
  return
}

type LicenseKey = {
  valid: boolean
}

async function validateLicense(_key: string, _instanceId: string): Promise<LicenseKey> {
  return { valid: true }
}

export { activateLicense, deactivateLicense, validateLicense }
