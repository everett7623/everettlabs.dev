import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const site = 'https://everettlabs.dev';

export default defineConfig({
  site,
  output: 'static',
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self' https://cloudflareinsights.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
        "manifest-src 'self'",
      ],
      scriptDirective: {
        resources: [
          "'self'",
          'https://static.cloudflareinsights.com',
          'https://*.googletagmanager.com',
        ],
      },
      styleDirective: {
        resources: ["'self'"],
      },
    },
  },
  markdown: {
    syntaxHighlight: 'prism',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => new URL(page).pathname.replace(/\/$/, '') !== '/404',
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: 'directory',
  },
});
