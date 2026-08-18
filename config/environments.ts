import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

export type EnvironmentName = 'dev' | 'sit' | 'uat' | 'prod';

const testEnv = (process.env.TEST_ENV as EnvironmentName) || 'dev';

// Load .env.<TEST_ENV> if it exists locally (these files are gitignored and
// never committed). CI is expected to inject real environment variables
// directly instead of relying on a committed file.
const envFile = path.resolve(__dirname, '..', `.env.${testEnv}`);
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile, quiet: true });
} else {
  dotenv.config({ quiet: true });
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        `Copy .env.example to .env.${testEnv} and fill in real values, ` +
        `or set it directly in your CI environment.`,
    );
  }
  return value;
}

export interface Environment {
  name: EnvironmentName;
  baseURL: string;
  apiBaseURL: string;
  username: string;
  password: string;
  apiKey?: string;
  headless: boolean;
  /** Base URL for the TestDino Demo Store scenario (tests/storedemo). */
  storedemoBaseURL: string;
}

export const environment: Environment = {
  name: testEnv,
  baseURL: required('BASE_URL'),
  apiBaseURL: required('API_BASE_URL'),
  username: required('TEST_USERNAME'),
  password: required('TEST_PASSWORD'),
  apiKey: process.env.API_KEY || undefined,
  headless: process.env.HEADLESS !== 'false',
  storedemoBaseURL: required('STOREDEMO_BASE_URL'),
};
