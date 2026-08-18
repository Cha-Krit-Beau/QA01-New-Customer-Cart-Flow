import { environment } from '../config/environments';

/**
 * The herokuapp demo site (the-internet.herokuapp.com) has no registration
 * flow of its own, so — unlike storedemo, which always registers a fresh
 * customer before logging in — this suite is still backed by one fixed
 * account. TEST_USERNAME/TEST_PASSWORD are optional; tests that need them
 * check this flag and skip themselves (with a clear reason) instead of
 * failing with a confusing "invalid credentials" error when it's unset.
 */
export const hasHerokuCredentials = Boolean(environment.username && environment.password);

/**
 * Credentials come from the environment (never hardcoded) so the same test
 * runs unchanged against dev/sit/uat with different real accounts. Falls
 * back to empty strings when unset — safe only because every test that
 * uses this guards on `hasHerokuCredentials` first via `test.skip(...)`.
 */
export const validUser = {
  username: environment.username ?? '',
  password: environment.password ?? '',
};

/** Negative-path fixtures for login tests. Deliberately static/invalid — not real accounts. */
export const invalidUsernameUser = {
  username: 'not_a_real_user',
  password: validUser.password,
};

export const invalidPasswordUser = {
  username: validUser.username,
  password: 'wrong-password-123',
};

export const emptyCredentialsUser = {
  username: '',
  password: '',
};
