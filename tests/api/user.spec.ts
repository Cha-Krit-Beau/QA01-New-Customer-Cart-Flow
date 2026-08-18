import { test, expect } from '../../fixtures/test.fixture';
import { Tags } from '../../constants/testConstants';

/**
 * API-only tests use Playwright's `request` context directly, via the
 * UserApi wrapper (api/user.api.ts) — no browser/page is launched for these.
 */
test.describe('User API', () => {
  test(`GET /users should return a list of users ${Tags.API} ${Tags.SMOKE}`, async ({
    userApi,
  }) => {
    const response = await userApi.list();

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('id');
    expect(body[0]).toHaveProperty('email');
  });

  test(`GET /users/:id should return a single user ${Tags.API} ${Tags.REGRESSION}`, async ({
    userApi,
  }) => {
    const response = await userApi.getById(2);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ id: 2 });
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('email');
  });

  test(`GET /users/:id should return 404 for a non-existent user ${Tags.API} ${Tags.REGRESSION}`, async ({
    userApi,
  }) => {
    const response = await userApi.getById(999999);

    expect(response.status()).toBe(404);
  });

  test(`POST /users should create a user ${Tags.API} ${Tags.REGRESSION}`, async ({ userApi }) => {
    const response = await userApi.create({ name: 'Automation QA', job: 'Test Engineer' });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toMatchObject({ name: 'Automation QA', job: 'Test Engineer' });
    expect(body.id).toBeTruthy();
  });
});
