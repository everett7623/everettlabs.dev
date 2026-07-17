import type { CryptoPaymentMethod } from '../types/crypto-payment.ts';
import {
  isBitcoinMainnetAddress,
  isEvmAddress,
  isTonMainnetFriendlyAddress,
  isTronMainnetAddress,
} from './crypto-address-validation.ts';

const addressValidators = {
  'usdt-trc20': isTronMainnetAddress,
  'usdc-base': isEvmAddress,
  'btc-bitcoin': isBitcoinMainnetAddress,
  'usdt-ton': isTonMainnetFriendlyAddress,
} satisfies Record<CryptoPaymentMethod['id'], (address: string) => boolean>;

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

    if (!addressValidators[method.id](address)) {
      throw new Error(`Invalid public receiving address for ${method.asset} on ${method.network}.`);
    }

    return [{ ...method, address }];
  });
}

export function getCryptoExplorerUrl(method: CryptoPaymentMethod): string {
  return explorerUrlBuilders[method.id](method.address);
}
