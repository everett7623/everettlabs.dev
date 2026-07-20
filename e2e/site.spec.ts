import { expect, test } from '@playwright/test';

test('renders the homepage and a project detail page', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Useful software for people who would rather automate it.' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore Projects' })).toHaveAttribute(
    'href',
    '/projects',
  );

  await page.goto('/projects/linketry');
  await expect(page.getByRole('heading', { name: 'Linketry', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute(
    'href',
    /github\.com\/everett7623\/Linketry/,
  );
});

test('renders Citeoryx in the product catalog and project detail page', async ({ page }) => {
  await page.goto('/projects');
  const products = page
    .getByRole('heading', { name: 'Products' })
    .locator('xpath=ancestor::section');
  await expect(products.getByRole('link', { name: /Citeoryx/ })).toBeVisible();

  await page.goto('/projects/citeoryx');
  await expect(page.getByRole('heading', { name: 'Citeoryx', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View on GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/everett7623/Citeoryx',
  );
  await expect(page.getByText('GPL-2.0-or-later', { exact: true })).toBeVisible();
});

test('renders and copies the four approved cryptocurrency addresses', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
    origin: 'http://127.0.0.1:4322',
  });
  await page.goto('/coffee');
  await expect(page).toHaveTitle('Buy Me a Coffee — Everett Labs');
  await expect(page.getByRole('heading', { level: 1, name: 'Buy Me a Coffee' })).toBeVisible();

  const payments = [
    {
      copyName: 'Copy USDT TRON (TRC20) receiving address',
      explorerName: 'View USDT TRON (TRC20) address on explorer',
      address: 'TWn6FFHfWv1JWYeWaeX8bjSfo1ZczSJi2z',
    },
    {
      copyName: 'Copy USDC Base Network receiving address',
      explorerName: 'View USDC Base Network address on explorer',
      address: '0x8f7785aac2e3155b0411d91a2b54cf0742672e9b',
    },
    {
      copyName: 'Copy BTC Bitcoin Mainnet receiving address',
      explorerName: 'View BTC Bitcoin Mainnet address on explorer',
      address: '13Zbh2uuvDi6obPWYrd832AXsWUznGs4wv',
    },
    {
      copyName: 'Copy USDT The Open Network (TON) receiving address',
      explorerName: 'View USDT The Open Network (TON) address on explorer',
      address: 'UQCI5wwTZYZooo6L4yMg0npeTZxr7yhZMyDmKhen7rJOnRrF',
    },
  ];

  await expect(page.locator('main article')).toHaveCount(payments.length);
  await expect(page.getByRole('img', { name: /receiving address QR code/ })).toHaveCount(
    payments.length,
  );

  for (const payment of payments) {
    const copyButton = page.getByRole('button', { name: payment.copyName });
    const paymentCard = copyButton.locator('xpath=ancestor::article');

    await copyButton.click();
    await expect(paymentCard.getByText('Address copied to clipboard.')).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(payment.address);
    await expect(page.getByRole('link', { name: payment.explorerName })).toHaveAttribute(
      'href',
      new RegExp(payment.address),
    );
  }
});

test('opens, filters, and closes the command palette with the keyboard', async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    'Keyboard command palette behavior is covered by the desktop browser project.',
  );

  await page.goto('/');

  const trigger = page.getByRole('button', { name: 'Open command palette' });
  const palette = page.getByRole('dialog', { name: 'Command palette' });
  await trigger.click();
  await expect(palette).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Search commands' })).toBeFocused();
  await expect
    .poll(() => page.locator('body').evaluate((body) => body.style.overflow))
    .toBe('hidden');
  await page.keyboard.press('Escape');
  await expect(palette).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect.poll(() => page.locator('body').evaluate((body) => body.style.overflow)).toBe('');

  await page.keyboard.press('Control+K');
  await expect(palette).toBeVisible();

  const search = page.getByRole('combobox', { name: 'Search commands' });
  await search.fill('Linketry');
  await expect(page.getByRole('option', { name: /Open Linketry/ })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(palette).toBeHidden();
});

test('opens the command palette from the mobile header control', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile header trigger is covered by the mobile browser project.');

  await page.goto('/');
  await page.getByRole('button', { name: 'Open command palette' }).click();
  await expect(page.getByRole('dialog', { name: 'Command palette' })).toBeVisible();
});

test('avoids horizontal overflow on key mobile routes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile layout is covered by the mobile browser project.');

  for (const route of [
    '/',
    '/projects',
    '/projects/linketry',
    '/projects/citeoryx',
    '/about',
    '/coffee',
  ]) {
    await page.goto(route);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
  }
});
