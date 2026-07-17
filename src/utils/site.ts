import type { CryptoPaymentMethod } from '../types/crypto-payment.ts';

const cryptoPayments = [
  {
    id: 'usdt-trc20',
    asset: 'USDT',
    network: 'TRON (TRC20)',
    address: 'TWn6FFHfWv1JWYeWaeX8bjSfo1ZczSJi2z',
    warning: 'Send only USDT over TRON (TRC20). Other assets or networks may be lost.',
  },
  {
    id: 'usdc-base',
    asset: 'USDC',
    network: 'Base Network',
    address: '0x8f7785aac2e3155b0411d91a2b54cf0742672e9b',
    warning: 'Send only native USDC over Base. Do not use another network.',
  },
  {
    id: 'btc-bitcoin',
    asset: 'BTC',
    network: 'Bitcoin Mainnet',
    address: '13Zbh2uuvDi6obPWYrd832AXsWUznGs4wv',
    warning: 'Send only BTC over Bitcoin mainnet. Do not use Lightning or another network.',
  },
  {
    id: 'usdt-ton',
    asset: 'USDT',
    network: 'The Open Network (TON)',
    address: 'UQCI5wwTZYZooo6L4yMg0npeTZxr7yhZMyDmKhen7rJOnRrF',
    warning: 'Send only USDT over The Open Network (TON). Do not send TON or another asset.',
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
