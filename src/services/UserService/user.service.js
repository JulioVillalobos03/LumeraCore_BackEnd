import { db } from "../../config/db.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import { AppError } from "../../utils/AppError.js";

/**
 * Listar todos los usuarios (admin/global)
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
export async function createUser({
  companyId,
  name,
  email,
  password,
  roleId = null,
}) {
  if (!companyId || !name || !email || !password) {
    throw new AppError("USERS_INVALID_INPUT");
  }

  // 1️⃣ Verificar si el usuario ya existe
  const [existing] = await db.query(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (existing.length > 0) {
    throw new AppError("USERS_ALREADY_EXISTS");
  }

  // 2️⃣ Crear usuario base
  const userId = uuid();
  const passwordHash = await bcrypt.hash(password, 10);

  await db.query(
    `
    INSERT INTO users (id, name, email, password_hash, status)
    VALUES (?, ?, ?, ?, 'active')
    `,
    [userId, name, email, passwordHash]
  );

  // 3️⃣ Vincular usuario con la empresa
  await db.query(
    `
    INSERT INTO company_users (id, company_id, user_id, role_id, status)
    VALUES (?, ?, ?, ?, 'active')
    `,
    [uuid(), companyId, userId, roleId]
  );

  return { userId };
}

/**
 * Actualizar usuario
 */
export async function updateUser({ id, name, email }) {
  if (!id || !name || !email) {
    throw new AppError("USERS_INVALID_INPUT");
  }

  const [result] = await db.query(
    `
    UPDATE users
    SET name = ?, email = ?
    WHERE id = ?
    `,
    [name, email, id]
  );

  if (result.affectedRows === 0) {
    throw new AppError("USERS_NOT_FOUND");
  }
}

/**
 * Cambiar status (active | blocked)
 */
export async function updateUserStatus({ id, status }) {
  if (!id || !["active", "blocked"].includes(status)) {
    throw new AppError("USERS_INVALID_INPUT");
  }

  const [result] = await db.query(
    `
    UPDATE users
    SET status = ?
    WHERE id = ?
    `,
    [status, id]
  );

  if (result.affectedRows === 0) {
    throw new AppError("USERS_NOT_FOUND");
  }
}

/**
 * Asignar rol a usuario dentro de una empresa
 */
export async function assignRole({ userId, companyId, roleId }) {
  if (!userId || !companyId || !roleId) {
    throw new AppError("USERS_INVALID_INPUT");
  }

  const [result] = await db.query(
    `
    UPDATE company_users
    SET role_id = ?
    WHERE user_id = ? AND company_id = ?
    `,
    [roleId, userId, companyId]
  );

  if (result.affectedRows === 0) {
    throw new AppError("USERS_NOT_FOUND");
  }
}
