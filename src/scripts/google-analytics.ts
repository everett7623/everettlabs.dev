export const GOOGLE_ANALYTICS_MEASUREMENT_ID = 'G-905QVGHLT6';

type GoogleTag = (...arguments_: unknown[]) => void;

declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag: GoogleTag;
  }
}

if (window.location.hostname === 'everettlabs.dev') {
  window.dataLayer ||= [];
  window.gtag = function gtag(...arguments_) {
    window.dataLayer.push(arguments_);
  };

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', GOOGLE_ANALYTICS_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  if (!document.querySelector('script[data-google-analytics]')) {
    const script = document.createElement('script');
    script.async = true;
    script.dataset.googleAnalytics = GOOGLE_ANALYTICS_MEASUREMENT_ID;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_MEASUREMENT_ID}`;
    document.head.append(script);
  }
}
