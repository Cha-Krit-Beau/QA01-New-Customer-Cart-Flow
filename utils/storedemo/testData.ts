import { randomEmail, randomString } from '../common';
import type { RegistrationDetails } from '../../pages/storedemo/RegisterPage';

/** A fresh, unique customer for registration tests — never a shared/fixed account. */
export function buildNewCustomer(): RegistrationDetails {
  return {
    firstName: 'QA',
    lastName: `Tester${randomString(4)}`,
    email: randomEmail('storedemo.test'),
    password: 'TestDino#2026',
  };
}
