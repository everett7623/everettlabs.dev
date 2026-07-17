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
      network: 'Base Network';
      address: string;
      warning: string;
    }
  | {
      id: 'btc-bitcoin';
      asset: 'BTC';
      network: 'Bitcoin Mainnet';
      address: string;
      warning: string;
    }
  | {
      id: 'usdt-ton';
      asset: 'USDT';
      network: 'The Open Network (TON)';
      address: string;
      warning: string;
    };

export type CryptoPaymentDisplay = CryptoPaymentMethod & {
  explorerUrl: string;
  qrDataUrl: string;
};
