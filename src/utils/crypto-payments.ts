import type { CryptoPaymentMethod } from '../types/crypto-payment.ts';

const addressPatterns = {
  'usdt-trc20': /^T[1-9A-HJ-NP-Za-km-z]{33}$/,
  'usdc-base': /^0x[a-fA-F0-9]{40}$/,
  'btc-bitcoin': /^bc1[a-z0-9]{11,71}$/,
} satisfies Record<CryptoPaymentMethod['id'], RegExp>;

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
