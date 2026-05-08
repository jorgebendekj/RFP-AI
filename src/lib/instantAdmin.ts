import { init } from "@instantdb/admin";

export const adminDb = init({
  appId: "5fe5517c-1f4b-400c-ab57-c3300f8c8ced",
  adminToken: process.env.INSTANTDB_ADMIN_TOKEN!,
});
