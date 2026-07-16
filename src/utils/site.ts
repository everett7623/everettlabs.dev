import type { CryptoPaymentMethod } from '../types/crypto-payment.ts';

const cryptoPayments = [
  {
    id: 'usdt-trc20',
    asset: 'USDT',
    network: 'TRON (TRC20)',
    address: '',
    warning: 'Send only USDT over TRON (TRC20) to this address.',
  },
  {
    id: 'usdc-base',
    asset: 'USDC',
    network: 'Base',
    address: '',
    warning: 'Send only native USDC over the Base network to this address.',
  },
  {
    id: 'btc-bitcoin',
    asset: 'BTC',
    network: 'Bitcoin',
    address: '',
    warning: 'Send only BTC over the Bitcoin network to this address. Do not use Lightning.',
  },
] satisfies readonly CryptoPaymentMethod[];

export const site = {
  title: 'Everett Labs',
  description:
    'Independent software lab for useful tools, open systems, and edge-native experiments.',
  url: 'https://everettlabs.dev',
  lang: 'en',
  github: 'https://github.com/everett7623',
  seedloc: 'https://seedloc.com',
  telegram: 'https://t.me/jensfrank',
  cryptoPayments,
};
