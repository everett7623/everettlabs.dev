import { describe, expect, it } from 'vitest';
import QRCode from 'qrcode';
import type { CryptoPaymentMethod } from '../src/types/crypto-payment.ts';
import { getConfiguredCryptoPayments } from '../src/utils/crypto-payments.ts';
import { site } from '../src/utils/site.ts';

const validPayments: CryptoPaymentMethod[] = [
  {
    id: 'usdt-trc20',
    asset: 'USDT',
    network: 'TRON (TRC20)',
    address: 'TJRabPrwbZy45sbavfcjinPJC18kjpRTv8',
    warning: 'TRON only.',
  },
  {
    id: 'usdc-base',
    asset: 'USDC',
    network: 'Base',
    address: '0x1111111111111111111111111111111111111111',
    warning: 'Base only.',
  },
  {
    id: 'btc-bitcoin',
    asset: 'BTC',
    network: 'Bitcoin',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    warning: 'Bitcoin only.',
  },
];

describe('crypto payment configuration', () => {
  it('omits every payment method with an empty address', () => {
    expect(getConfiguredCryptoPayments(site.cryptoPayments)).toEqual([]);
  });

  it('accepts the supported network address formats', () => {
    expect(getConfiguredCryptoPayments(validPayments)).toEqual(validPayments);
  });

  it.each([
    ['usdt-trc20', '0x1111111111111111111111111111111111111111'],
    ['usdc-base', 'TJRabPrwbZy45sbavfcjinPJC18kjpRTv8'],
    ['btc-bitcoin', '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy'],
  ] as const)('rejects an invalid %s receiving address', (id, address) => {
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

  it('keeps exactly the three approved asset and network pairs', () => {
    expect(site.cryptoPayments.map(({ asset, network }) => `${asset}:${network}`)).toEqual([
      'USDT:TRON (TRC20)',
      'USDC:Base',
      'BTC:Bitcoin',
    ]);
    expect('buyMeACoffee' in site).toBe(false);
    expect('githubSponsors' in site).toBe(false);
    expect('wechatQr' in site).toBe(false);
    expect('alipayQr' in site).toBe(false);
  });
});
