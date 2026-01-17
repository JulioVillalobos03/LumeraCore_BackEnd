import { db } from "../../config/db.js";
import { randomUUID } from "crypto";

/**
 * Asignar usuario a empresa
 */
export async function assignUserToCompany({ userId, companyId }) {
  // validar que no exista ya
  const [exists] = await db.query(
    `SELECT id FROM company_users
     WHERE user_id = ? AND company_id = ?
     LIMIT 1`,
    [userId, companyId]
  );

  if (exists.length > 0) {
    const err = new Error("User already assigned to this company");
    err.statusCode = 409;
    throw err;
  }

  await db.query(
    `INSERT INTO company_users (id, user_id, company_id, status)
     VALUES (?, ?, ?, 'active')`,
    [randomUUID(), userId, companyId]
  );
}

/**
 * Listar usuarios de una empresa
 */
export async function getCompanyUsers(companyId) {
  const [rows] = await db.query(`
    SELECT
      cu.id AS company_user_id,
      u.id AS user_id,
      u.name,
      u.email,
      cu.status
    FROM company_users cu
    JOIN users u ON u.id = cu.user_id
    WHERE cu.company_id = ?
  `, [companyId]);

  return rows;
}

/**
 * Obtener usuarios de una empresa (empresa activa)
 */
export async function getUsersByCompany(companyId) {
  const [rows] = await db.query(
    `SELECT
        cu.id AS company_user_id,
        u.id AS user_id,
        u.name,
        u.email,
        cu.status,
        u.created_at
     FROM company_users cu
     INNER JOIN users u ON u.id = cu.user_id
     WHERE cu.company_id = ?
     ORDER BY u.created_at DESC`,
    [companyId]
  );

  return rows;
}


/**
 * Desactivar usuario en empresa
 */
export async function updateCompanyUserStatus({ id, status }) {
  await db.query(
    `UPDATE company_users
     SET status = ?
     WHERE id = ?`,
    [status, id]
  );
}
