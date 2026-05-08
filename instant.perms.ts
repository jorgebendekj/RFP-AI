export default {
  profiles: {
    allow: {
      view: "auth.id != null",
      create: "auth.id != null",
      update: "auth.id == data.ref('userId') || auth.email == 'ADMIN_EMAIL'",
      delete: "false",
    },
  },
  siceosSettings: {
    allow: {
      view: "auth.id != null",
      create: "auth.id != null",
      update: "auth.id != null",
      delete: "false",
    },
  },
  siceosScans: {
    allow: {
      view: "auth.id != null",
      create: "auth.id != null",
      update: "false",
      delete: "false",
    },
  },
};
