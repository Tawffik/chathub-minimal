interface PremiumActivation {
  licenseKey: string
  instanceId: string
}

/** Always treat premium as activated — no remote license checks. */
export async function activatePremium(licenseKey: string): Promise<PremiumActivation> {
  const data: PremiumActivation = {
    licenseKey: licenseKey || 'unlocked',
    instanceId: 'local-unlocked',
  }
  localStorage.setItem('premium', JSON.stringify(data))
  return data
}

export async function validatePremium() {
  return { valid: true as const }
}

export async function deactivatePremium() {
  localStorage.removeItem('premium')
}

export function getPremiumActivation(): PremiumActivation | null {
  const data = localStorage.getItem('premium')
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }
  // Default: act as if premium is present so UI stays unlocked
  return { licenseKey: 'unlocked', instanceId: 'local-unlocked' }
}
