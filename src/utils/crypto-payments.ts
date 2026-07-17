import type { CryptoPaymentMethod } from '../types/crypto-payment.ts';

const addressPatterns = {
  'usdt-trc20': /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
  'usdc-base': /^0x[a-fA-F0-9]{40}$/,
  'btc-bitcoin': /^(?:[13][1-9A-HJ-NP-Za-km-z]{25,34}|bc1[a-z0-9]{11,71})$/,
  'usdt-ton': /^(?:EQ|UQ|kQ|0Q)[A-Za-z0-9_-]{46}$/,
} satisfies Record<CryptoPaymentMethod['id'], RegExp>;

const explorerUrlBuilders = {
  'usdt-trc20': (address: string) =>
    `https://tronscan.org/#/address/${encodeURIComponent(address)}`,
  'usdc-base': (address: string) => `https://basescan.org/address/${encodeURIComponent(address)}`,
  'btc-bitcoin': (address: string) =>
    `https://mempool.space/address/${encodeURIComponent(address)}`,
  'usdt-ton': (address: string) => `https://tonviewer.com/${encodeURIComponent(address)}`,
} satisfies Record<CryptoPaymentMethod['id'], (address: string) => string>;

export function getConfiguredCryptoPayments(
  methods: readonly CryptoPaymentMethod[],
): CryptoPaymentMethod[] {
  return methods.flatMap((method) => {
    const address = method.address.trim();

    if (!address) {
      return [];
    }

    if (!addressPatterns[method.id].test(address)) {
      throw new Error(`Invalid public receiving address for ${method.asset} on ${method.network}.`);
    }

    return [{ ...method, address }];
  });
}

export function getCryptoExplorerUrl(method: CryptoPaymentMethod): string {
  return explorerUrlBuilders[method.id](method.address);
}
