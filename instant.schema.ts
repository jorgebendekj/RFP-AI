import { i } from "@instantdb/core";

const graph = i.graph(
  {
    profiles: i.entity({
      email: i.string().unique().indexed(),
      name: i.string().optional(),
      role: i.string(), // "admin" | "client"
      enabled: i.boolean(),
      createdAt: i.number(),
    }),
    siceosSettings: i.entity({
      userId: i.string().unique().indexed(),
      enabled: i.boolean(),
      notifyEnabled: i.boolean(),
      companyType: i.string(),
      keywords: i.json(),
      department: i.string().optional(),
      category: i.string().optional(),
      updatedAt: i.number(),
    }),
    siceosScans: i.entity({
      userId: i.string().indexed(),
      userEmail: i.string(),
      status: i.string(), // "running" | "done" | "error"
      tenders: i.json(),
      summary: i.string().optional(),
      createdAt: i.number(),
      companyType: i.string(),
    }),
  },
  {}
);

export default graph;
