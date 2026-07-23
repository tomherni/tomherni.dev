import { BASE_URL_DEV, BASE_URL_PROD } from './constants.js';

// Website title and description. Used in page meta tags and feeds.
export const TITLE = 'tomherni.dev';
export const DESCRIPTION = 'Personal website of Tom Herni.';

// Author of posts. Used in feeds.
export const AUTHOR = {
  name: 'Tom Herni',
  email: 'tomherni@gmail.com',
};

export const BUILD = {
  ...getBaseUrlAndEnv(),
  date: new Date(),
};

function getBaseUrlAndEnv(): { env: 'DEV' | 'PROD'; baseUrl: string } {
  const { CONTEXT, DEPLOY_PRIME_URL } = process.env;

  // Detect Netlify's Deploy Preview deployment.
  if (CONTEXT === 'deploy-preview' && DEPLOY_PRIME_URL) {
    return { baseUrl: DEPLOY_PRIME_URL, env: 'PROD' };
  }

  // Detect Netlify's production deployment.
  if (CONTEXT === 'production') {
    return { baseUrl: BASE_URL_PROD, env: 'PROD' };
  }

  // Ensure the build is not running in an unexpected Netlify environment.
  // The base URL would need to be checked first.
  if (typeof CONTEXT !== 'undefined') {
    throw new Error('Unknown build environment');
  }

  return { baseUrl: BASE_URL_DEV, env: 'DEV' };
}
