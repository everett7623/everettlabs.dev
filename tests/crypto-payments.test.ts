import { describe, expect, it } from 'vitest';
import QRCode from 'qrcode';
import type { CryptoPaymentMethod } from '../src/types/crypto-payment.ts';
import { getConfiguredCryptoPayments, getCryptoExplorerUrl } from '../src/utils/crypto-payments.ts';
import { site } from '../src/utils/site.ts';

const validPayments: CryptoPaymentMethod[] = [
  {
    id: 'usdt-trc20',
    asset: 'USDT',
    network: 'TRON (TRC20)',
    address: 'TWn6FFHfWv1JWYeWaeX8bjSfo1ZczSJi2z',
    warning: 'TRON only.',
  },
  {
    id: 'usdc-base',
    asset: 'USDC',
    network: 'Base Network',
    address: '0x8f7785aac2e3155b0411d91a2b54cf0742672e9b',
    warning: 'Base only.',
  },
  {
    id: 'btc-bitcoin',
    asset: 'BTC',
    network: 'Bitcoin Mainnet',
    address: '13Zbh2uuvDi6obPWYrd832AXsWUznGs4wv',
    warning: 'Bitcoin only.',
  },
  {
    id: 'usdt-ton',
    asset: 'USDT',
    network: 'The Open Network (TON)',
    address: 'UQCI5wwTZYZooo6L4yMg0npeTZxr7yhZMyDmKhen7rJOnRrF',
    warning: 'TON only.',
  },
];

describe('crypto payment configuration', () => {
  it('omits every payment method with an empty address', () => {
    const emptyPayments = validPayments.map((payment) => ({ ...payment, address: '' }));

    expect(getConfiguredCryptoPayments(emptyPayments)).toEqual([]);
  });

  it('accepts the supported network address formats', () => {
    expect(getConfiguredCryptoPayments(validPayments)).toEqual(validPayments);
  });

  it('accepts a checksummed Bitcoin mainnet SegWit address', () => {
    const bitcoin = validPayments.find((payment) => payment.id === 'btc-bitcoin');

    if (!bitcoin) {
      throw new Error('Missing Bitcoin test payment fixture.');
    }

    const address = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
    expect(getConfiguredCryptoPayments([{ ...bitcoin, address }])[0].address).toBe(address);
  });

  it('rejects an unverified mixed-case Base address', () => {
    const base = validPayments.find((payment) => payment.id === 'usdc-base');

    if (!base) {
      throw new Error('Missing Base test payment fixture.');
    }

    expect(() =>
      getConfiguredCryptoPayments([
        { ...base, address: '0x8f7785aac2e3155b0411d91A2b54cf0742672e9b' },
      ]),
    ).toThrow('Invalid public receiving address');
  });

  it.each([
    ['usdt-trc20', '0x1111111111111111111111111111111111111111'],
    ['usdc-base', 'TJRabPrwbZy45sbavfcjinPJC18kjpRTv8'],
    ['btc-bitcoin', 'tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'],
    ['usdt-ton', '0x1111111111111111111111111111111111111111'],
  ] as const)('rejects an invalid %s receiving address', (id, address) => {
    const payment = validPayments.find((candidate) => candidate.id === id);

    if (!payment) {
      throw new Error(`Missing test payment fixture for ${id}.`);
    }

    expect(() => getConfiguredCryptoPayments([{ ...payment, address }])).toThrow(
      'Invalid public receiving address',
    );
  });

  it.each([
    ['usdt-trc20', 'TWn6FFHfWv1JWYeWaeX8bjSfo1ZczSJi2y'],
    ['btc-bitcoin', '13Zbh2uuvDi6obPWYrd832AXsWUznGs4ww'],
    ['usdt-ton', 'UQCI5wwTZYZooo6L4yMg0npeTZxr7yhZMyDmKhen7rJOnRrG'],
  ] as const)('rejects a checksum-invalid %s receiving address', (id, address) => {
    const payment = validPayments.find((candidate) => candidate.id === id);

    if (!payment) {
      throw new Error(`Missing test payment fixture for ${id}.`);
    }

    expect(() => getConfiguredCryptoPayments([{ ...payment, address }])).toThrow(
      'Invalid public receiving address',
    );
  });

  it('generates QR images locally from a configured public address', async () => {
    const qrDataUrl = await QRCode.toDataURL(validPayments[0].address, { width: 320 });

    expect(qrDataUrl.startsWith('data:image/png;base64,')).toBe(true);
  });

  it('maps each payment to its matching address explorer', () => {
    expect(validPayments.map(getCryptoExplorerUrl)).toEqual([
      'https://tronscan.org/#/address/TWn6FFHfWv1JWYeWaeX8bjSfo1ZczSJi2z',
      'https://basescan.org/address/0x8f7785aac2e3155b0411d91a2b54cf0742672e9b',
      'https://mempool.space/address/13Zbh2uuvDi6obPWYrd832AXsWUznGs4wv',
      'https://tonviewer.com/UQCI5wwTZYZooo6L4yMg0npeTZxr7yhZMyDmKhen7rJOnRrF',
    ]);
  });

  it('keeps the approved Ko-fi URL and exactly four public asset and network pairs', () => {
    expect(site.koFi).toBe('https://ko-fi.com/everettlabs');
    expect(site.cryptoPayments.map(({ asset, network }) => `${asset}:${network}`)).toEqual([
      'USDT:TRON (TRC20)',
      'USDC:Base Network',
      'BTC:Bitcoin Mainnet',
      'USDT:The Open Network (TON)',
    ]);
    expect(site.cryptoPayments.map(({ address }) => address)).toEqual([
      'TWn6FFHfWv1JWYeWaeX8bjSfo1ZczSJi2z',
      '0x8f7785aac2e3155b0411d91a2b54cf0742672e9b',
      '13Zbh2uuvDi6obPWYrd832AXsWUznGs4wv',
      'UQCI5wwTZYZooo6L4yMg0npeTZxr7yhZMyDmKhen7rJOnRrF',
    ]);
    expect('buyMeACoffee' in site).toBe(false);
    expect('githubSponsors' in site).toBe(false);
    expect('wechatQr' in site).toBe(false);
    expect('alipayQr' in site).toBe(false);
  });
});
