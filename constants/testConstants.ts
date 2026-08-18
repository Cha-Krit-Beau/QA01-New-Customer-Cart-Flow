/**
 * Central place for tag names, routes and user-facing copy so that string
 * literals aren't scattered (and duplicated) across spec files.
 */

export const Tags = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  SANITY: '@sanity',
  CRITICAL: '@critical',
  API: '@api',
  UI: '@ui',
} as const;

/** Routes on the UI under test, relative to BASE_URL. */
export const Routes = {
  LOGIN: '/login',
  SECURE_AREA: '/secure',
  DYNAMIC_CONTENT: '/dynamic_content',
} as const;

/** Flash/status messages the app under test renders, used in assertions. */
export const Messages = {
  LOGIN_SUCCESS: 'You logged into a secure area!',
  LOGIN_INVALID_USERNAME: 'Your username is invalid!',
  LOGIN_INVALID_PASSWORD: 'Your password is invalid!',
  LOGIN_REQUIRED: 'You must login to view the secure area!',
  LOGOUT_SUCCESS: 'You logged out of the secure area!',
} as const;
