import { ofetch } from 'ofetch'

// All calls to chathub.gg disabled for privacy-focused minimal build.
// Premium / formkey helpers that depended on their backend are no-ops now.

export async function decodePoeFormkey(_html: string): Promise<string> {
  throw new Error('Poe formkey decoding disabled in minimal build')
}

type ActivateResponse =
  | {
      activated: true
      instance: { id: string }
      meta: { product_id: number }
    }
  | { activated: false; error: string }

export async function activateLicense(_key: string, _instanceName: string): Promise<ActivateResponse> {
  return { activated: false, error: 'Premium activation disabled in minimal build' }
}

interface Product {
  price: number
}

export async function fetchPremiumProduct(): Promise<Product> {
  return { price: 0 }
}

export async function createDiscount() {
  return { code: '', startTime: 0 }
}

export interface Discount {
  code: string
  startTime: number
  price: number
  percent: number
}

export interface Campaign {
  description: string
  code: string
  price: number
}

interface PurchaseInfo {
  price: number
  discount?: Discount
  campaign?: Campaign
}

export async function fetchPurchaseInfo(): Promise<PurchaseInfo> {
  return { price: 0 }
}

export async function checkDiscount(_params: { appOpenTimes: number; premiumModalOpenTimes: number }) {
  return { show: false }
}
