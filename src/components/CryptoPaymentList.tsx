import { Check, Copy, ExternalLink, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import type { CryptoPaymentDisplay } from '../types/crypto-payment.ts';

interface Props {
  payments: CryptoPaymentDisplay[];
}

type CopyStatus = 'idle' | 'copied' | 'failed';

export default function CryptoPaymentList({ payments }: Props) {
  const [copyStatuses, setCopyStatuses] = useState<Record<string, CopyStatus>>({});

  async function copyAddress(payment: CryptoPaymentDisplay) {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API unavailable');
      }

      await navigator.clipboard.writeText(payment.address);
      setCopyStatuses((current) => ({ ...current, [payment.id]: 'copied' }));
    } catch {
      setCopyStatuses((current) => ({ ...current, [payment.id]: 'failed' }));
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {payments.map((payment) => {
        const status = copyStatuses[payment.id] ?? 'idle';

        return (
          <article
            key={payment.id}
            className="flex min-w-0 flex-col rounded-lg border border-border bg-surface p-5 text-left"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-text-muted">{payment.network}</p>
                <h2 className="mt-1 text-2xl font-semibold text-text-primary">{payment.asset}</h2>
              </div>
              <span className="rounded border border-status-green/30 px-2 py-1 font-mono text-xs text-status-green">
                ACTIVE
              </span>
            </div>

            <img
              src={payment.qrDataUrl}
              alt={`${payment.asset} on ${payment.network} receiving address QR code`}
              width={320}
              height={320}
              className="mx-auto mt-5 aspect-square w-full max-w-52 rounded bg-text-primary p-2"
            />

            <p className="mt-5 font-mono text-xs text-text-muted">RECEIVING ADDRESS</p>
            <code className="mt-2 block min-h-20 break-all rounded border border-border bg-background p-3 text-xs leading-5 text-text-secondary">
              {payment.address}
            </code>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void copyAddress(payment)}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-accent-violet px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-violet/90"
                aria-label={`Copy ${payment.asset} ${payment.network} receiving address`}
              >
                {status === 'copied' ? (
                  <Check aria-hidden="true" size={17} />
                ) : (
                  <Copy aria-hidden="true" size={17} />
                )}
                {status === 'copied'
                  ? 'Copied'
                  : status === 'failed'
                    ? 'Retry copy'
                    : 'Copy address'}
              </button>
              <a
                href={payment.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-text-muted hover:text-text-primary"
                aria-label={`View ${payment.asset} ${payment.network} address on explorer`}
              >
                <ExternalLink aria-hidden="true" size={17} />
                View address
              </a>
            </div>

            <p
              role="status"
              aria-live="polite"
              className={`mt-2 min-h-5 text-xs ${status === 'failed' ? 'text-danger' : 'text-status-green'}`}
            >
              {status === 'copied' && 'Address copied to clipboard.'}
              {status === 'failed' && 'Copy failed. Select the address manually.'}
            </p>

            <p className="mt-3 flex gap-2 border-t border-border pt-4 text-xs leading-5 text-text-secondary">
              <TriangleAlert
                aria-hidden="true"
                size={16}
                className="mt-0.5 shrink-0 text-warning"
              />
              <span>{payment.warning}</span>
            </p>
          </article>
        );
      })}
    </div>
  );
}
