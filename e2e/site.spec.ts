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

  for (const route of ['/', '/projects', '/projects/linketry', '/about', '/coffee']) {
    await page.goto(route);
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
  }
});
