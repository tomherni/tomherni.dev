import { build } from './build';

// Test: verifying envs in Netlify deploy preview and prod builds
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CONTEXT:', process.env.CONTEXT);
console.log('DEPLOY_PRIME_URL:', process.env.DEPLOY_PRIME_URL);
console.log('REVIEW_ID:', process.env.REVIEW_ID);
console.log('URL:', process.env.URL);

await build({ env: 'PROD', baseUrl: 'https://tomherni.dev/' });
