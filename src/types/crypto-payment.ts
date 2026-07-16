export type CryptoPaymentMethod =
  | {
      id: 'usdt-trc20';
      asset: 'USDT';
      network: 'TRON (TRC20)';
      address: string;
      warning: string;
    }
  | {
      id: 'usdc-base';
      asset: 'USDC';
      network: 'Base';
      address: string;
      warning: string;
    }
  | {
      id: 'btc-bitcoin';
      asset: 'BTC';
      network: 'Bitcoin';
      address: string;
      warning: string;
    };

export type CryptoPaymentDisplay = CryptoPaymentMethod & {
  qrDataUrl: string;
};
