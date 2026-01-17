export const DEFAULT_ROLES = {
  ADMIN: "ADMIN",
};

export const DEFAULT_PERMISSIONS = [
  "users.create",
  "users.read",
  "users.update",
  "users.change_status",

  "roles.create",
  "roles.read",
  "roles.assign",

  "permissions.create",
  "permissions.assign",

  "inventory.read",
  "inventory.adjust",
  "inventory.movements.read",

  "products.create",
  "products.read",
  "products.update",

  "clients.create",
  "clients.read",
  "clients.update",

  "purchases.create",
  "purchases.receive",

  "custom_fields.create",
  "custom_fields.read",

  "employees.create",
  "employees.read",
  "employees.update",
  "employees.change_status",
];
