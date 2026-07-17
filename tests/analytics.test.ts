import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const analyticsSource = readFileSync(
  join(process.cwd(), 'src/scripts/google-analytics.ts'),
  'utf-8',
);
const layoutSource = readFileSync(join(process.cwd(), 'src/layouts/Layout.astro'), 'utf-8');

describe('Google Analytics configuration', () => {
  it('loads the approved measurement ID on every page', () => {
    expect(analyticsSource).toContain("GOOGLE_ANALYTICS_MEASUREMENT_ID = 'G-905QVGHLT6'");
    expect(analyticsSource).toContain("window.location.hostname === 'everettlabs.dev'");
    expect(analyticsSource).toContain('https://www.googletagmanager.com/gtag/js?id=');
    expect(layoutSource).toContain('<script src="../scripts/google-analytics.ts"></script>');
  });

  it('queues consent defaults before loading the remote tag', () => {
    expect(analyticsSource.indexOf("window.gtag('consent', 'default'")).toBeLessThan(
      analyticsSource.indexOf('script.src ='),
    );
  });

  it.each(['analytics_storage', 'ad_storage', 'ad_user_data', 'ad_personalization'])(
    'denies %s by default',
    (consentType) => {
      expect(analyticsSource).toContain(`${consentType}: 'denied'`);
    },
  );

  it('disables advertising and personalization signals', () => {
    expect(analyticsSource).toContain('allow_google_signals: false');
    expect(analyticsSource).toContain('allow_ad_personalization_signals: false');
    expect(analyticsSource).not.toMatch(/doubleclick|googleadservices|googlesyndication/i);
  });
});
