import { db } from "../../config/db.js";
import { v4 as uuid } from "uuid";

export async function getAllPermissions() {
  const [rows] = await db.query(
    `
    SELECT id, permission_key
    FROM permissions
    ORDER BY permission_key
    `
  );

  return rows;
}
export async function createPermission(permissionKey) {
  // validar que no exista
  const [exists] = await db.query(
    `SELECT id FROM permissions WHERE permission_key = ? LIMIT 1`,
    [permissionKey]
  );

  if (exists.length) {
    throw new Error("Permission already exists");
  }

  const id = uuid();

  await db.query(
    `INSERT INTO permissions (id, permission_key) VALUES (?, ?)`,
    [id, permissionKey]
  );

  return {
    id,
    permission_key: permissionKey,
  };
}

export async function ensurePermission(permissionKey) {
  // intenta encontrar
  const [found] = await db.query(
    `SELECT id, permission_key FROM permissions WHERE permission_key = ? LIMIT 1`,
    [permissionKey]
  );

  if (found.length) return found[0];

  // si no existe, lo crea
  const id = uuid();
  await db.query(
    `INSERT INTO permissions (id, permission_key) VALUES (?, ?)`,
    [id, permissionKey]
  );

  return { id, permission_key: permissionKey };
}

export async function assignPermissionToRole({ roleId, permissionId }) {
  await db.query(
    `INSERT IGNORE INTO role_permissions (role_id, permission_id)
     VALUES (?, ?)`,
    [roleId, permissionId]
  );
}

export async function getPermissionsByUser({ userId, companyId }) {
  const [rows] = await db.query(
    `
    SELECT DISTINCT p.permission_key
    FROM company_users cu
    INNER JOIN roles r ON r.id = cu.role_id
    INNER JOIN role_permissions rp ON rp.role_id = r.id
    INNER JOIN permissions p ON p.id = rp.permission_id
    WHERE cu.user_id = ?
      AND cu.company_id = ?
      AND cu.status = 'active'
    `,
    [userId, companyId]
  );

  return rows.map(r => r.permission_key);
}