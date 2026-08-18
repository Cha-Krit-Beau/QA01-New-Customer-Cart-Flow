import {
  invalidUsernameUser,
  invalidPasswordUser,
  emptyCredentialsUser,
} from '../../utils/testData';
import { Messages } from '../../constants/testConstants';

export interface LoginNegativeCase {
  name: string;
  username: string;
  password: string;
  expectedMessage: string;
}

export const negativeLoginCases: LoginNegativeCase[] = [
  {
    name: 'invalid username',
    username: invalidUsernameUser.username,
    password: invalidUsernameUser.password,
    expectedMessage: Messages.LOGIN_INVALID_USERNAME,
  },
  {
    name: 'invalid password',
    username: invalidPasswordUser.username,
    password: invalidPasswordUser.password,
    expectedMessage: Messages.LOGIN_INVALID_PASSWORD,
  },
  {
    name: 'empty username and password',
    username: emptyCredentialsUser.username,
    password: emptyCredentialsUser.password,
    expectedMessage: Messages.LOGIN_INVALID_USERNAME,
  },
];
