import { db } from "../../config/db.js";
import { randomUUID } from "crypto";

/**
 * Crear rol para empresa
 */
export async function createRole({ name, companyId }) {
  const id = randomUUID();

  await db.query(
    `INSERT INTO roles (id, company_id, name)
     VALUES (?, ?, ?)`,
    [id, companyId, name]
  );

  return { id, name };
}

/**
 * Listar roles de empresa
 */
export async function getRolesByCompany(companyId) {
  const [rows] = await db.query(
    `SELECT id, name
     FROM roles
     WHERE company_id = ?
     ORDER BY name ASC`,
    [companyId]
  );

  return rows;
}

/**
 * Asignar rol a usuario en empresa
 */
export async function assignRoleToUser({ companyUserId, roleId }) {
  await db.query(
    `UPDATE company_users
     SET role_id = ?
     WHERE id = ?`,
    [roleId, companyUserId]
  );
}


export async function ensureRole({ companyId, name }) {
  const roleName = name.toUpperCase();

  const [found] = await db.query(
    `SELECT id, name FROM roles WHERE company_id = ? AND name = ? LIMIT 1`,
    [companyId, roleName]
  );

  if (found.length) return found[0];

  const id = uuid();
  await db.query(
    `INSERT INTO roles (id, company_id, name) VALUES (?, ?, ?)`,
    [id, companyId, roleName]
  );

  return { id, name: roleName };
}