import { db } from "../../config/db.js";
import { randomUUID } from "crypto";
import { ensureRole } from "../RoleService/role.service.js";
import { ensurePermission, assignPermissionToRole } from "../PermissionService/permission.service.js";
import { v4 as uuid } from "uuid";
import { DEFAULT_ROLES, DEFAULT_PERMISSIONS } from "../../config/bootstrap.js";


/**
 * Crear empresa
 */
export async function createCompany({ name }) {
  const id = randomUUID();

  await db.query(
    `INSERT INTO companies (id, name, status)
     VALUES (?, ?, 'active')`,
    [id, name]
  );

  return { id, name, status: "active" };
}

/**
 * Listar empresas
 */
export async function getAllCompanies() {
  const [rows] = await db.query(`
    SELECT id, name, status, created_at
    FROM companies
    ORDER BY created_at DESC
  `);

  return rows;
}

/**
 * Actualizar empresa
 */
export async function updateCompany({ id, name }) {
  await db.query(
    `UPDATE companies
     SET name = ?
     WHERE id = ?`,
    [name, id]
  );
}

/**
 * Cambiar status
 */
export async function updateCompanyStatus({ id, status }) {
  await db.query(
    `UPDATE companies
     SET status = ?
     WHERE id = ?`,
    [status, id]
  );
}


export async function createCompanyWithBootstrap({ userId, name }) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1) crear company
    const companyId = uuid();
    await connection.query(
      `INSERT INTO companies (id, name, status) VALUES (?, ?, 'active')`,
      [companyId, name]
    );

    // 2) asegurar rol ADMIN para esa company
    // (IMPORTANTE: ensureRole usa pool, pero aquí queremos usar la MISMA transacción)
    // Para eso, repetimos el ensureRole usando "connection" en vez de pool:

    const adminRoleName = DEFAULT_ROLES.ADMIN;

    const [roleFound] = await connection.query(
      `SELECT id, name FROM roles WHERE company_id = ? AND name = ? LIMIT 1`,
      [companyId, adminRoleName]
    );

    let adminRoleId;
    if (roleFound.length) {
      adminRoleId = roleFound[0].id;
    } else {
      adminRoleId = uuid();
      await connection.query(
        `INSERT INTO roles (id, company_id, name) VALUES (?, ?, ?)`,
        [adminRoleId, companyId, adminRoleName]
      );
    }

    // 3) vincular user a company con role ADMIN
    await connection.query(
      `INSERT INTO company_users (id, company_id, user_id, role_id, status)
       VALUES (?, ?, ?, ?, 'active')`,
      [uuid(), companyId, userId, adminRoleId]
    );

    // 4) asegurar permisos globales + asignarlos al rol ADMIN
    // aquí igual: no usamos ensurePermission() porque usa pool; lo hacemos con connection:
    for (const key of DEFAULT_PERMISSIONS) {
      const [permFound] = await connection.query(
        `SELECT id FROM permissions WHERE permission_key = ? LIMIT 1`,
        [key]
      );

      let permId;
      if (permFound.length) {
        permId = permFound[0].id;
      } else {
        permId = uuid();
        await connection.query(
          `INSERT INTO permissions (id, permission_key) VALUES (?, ?)`,
          [permId, key]
        );
      }

      // asignar permiso al rol admin
      await connection.query(
        `INSERT IGNORE INTO role_permissions (role_id, permission_id)
         VALUES (?, ?)`,
        [adminRoleId, permId]
      );
    }

    await connection.commit();

    return {
      companyId,
      adminRoleId,
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}
