import { db } from "../../config/db.js";
import { v4 as uuid } from "uuid"; // ✅ ESTE FALTABA
import bcrypt from "bcryptjs";

/**
 * Listar todos los usuarios
 */
export async function getAllUsers() {
  const [rows] = await db.query(`
    SELECT id, name, email, status, created_at
    FROM users
    ORDER BY created_at DESC
  `);

  return rows;
}


/**
 * Crear usuario dentro de una empresa (ERP)
 */
export const createUser = async ({
  companyId,
  name,
  email,
  password,
  roleId = null,
}) => {
  // 1️⃣ Verificar si el usuario ya existe
  const [existing] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    throw new Error("User already exists");
  }

  // 2️⃣ Crear usuario base
  const userId = uuid();
  const passwordHash = await bcrypt.hash(password, 10);

  await db.query(
    `
    INSERT INTO users (id, name, email, password_hash)
    VALUES (?, ?, ?, ?)
    `,
    [userId, name, email, passwordHash]
  );

  // 3️⃣ Vincular usuario con la empresa
  await db.query(
    `
    INSERT INTO company_users (id, company_id, user_id, role_id)
    VALUES (?, ?, ?, ?)
    `,
    [uuid(), companyId, userId, roleId]
  );

  return { userId };
};

/**
 * Actualizar usuario
 */
export async function updateUser({ id, name, email }) {
  await db.query(
    `UPDATE users
     SET name = ?, email = ?
     WHERE id = ?`,
    [name, email, id]
  );
}

/**
 * Cambiar status (active | blocked)
 */
export async function updateUserStatus({ id, status }) {
  await db.query(
    `UPDATE users
     SET status = ?
     WHERE id = ?`,
    [status, id]
  );
}


export const assignRole = async ({ userId, companyId, roleId }) => {
  await db.query(
    `
    UPDATE company_users
    SET role_id = ?
    WHERE user_id = ? AND company_id = ?
    `,
    [roleId, userId, companyId]
  );
};