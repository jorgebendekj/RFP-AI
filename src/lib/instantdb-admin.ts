import { init } from '@instantdb/admin';

const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID || '';
const ADMIN_TOKEN = process.env.INSTANTDB_ADMIN_TOKEN || '';

if (!APP_ID) {
  throw new Error('NEXT_PUBLIC_INSTANTDB_APP_ID is not set');
}

if (!ADMIN_TOKEN) {
  console.warn('⚠️ INSTANTDB_ADMIN_TOKEN is not set. Admin operations will fail.');
  console.warn('📝 Please get your admin token from: https://www.instantdb.com/dash');
  console.warn('   And add it to your .env file as: INSTANTDB_ADMIN_TOKEN=your_token_here');
}

// Initialize InstantDB Admin SDK
export const adminDB = init({ 
  appId: APP_ID,
  adminToken: ADMIN_TOKEN 
});

export function isAdminConfigured(): boolean {
  return Boolean(ADMIN_TOKEN);
}



