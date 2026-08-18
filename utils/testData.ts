import { environment } from '../config/environments';

/**
 * Credentials come from the environment (never hardcoded) so the same test
 * runs unchanged against dev/sit/uat with different real accounts.
 */
export const validUser = {
  username: environment.username,
  password: environment.password,
};

/** Negative-path fixtures for login tests. Deliberately static/invalid — not real accounts. */
export const invalidUsernameUser = {
  username: 'not_a_real_user',
  password: environment.password,
};

export const invalidPasswordUser = {
  username: environment.username,
  password: 'wrong-password-123',
};

export const emptyCredentialsUser = {
  username: '',
  password: '',
};
