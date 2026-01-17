import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { db } from "../../config/db.js";

export async function createUser({ name, email, password }) {
  // 1) Validar si ya existe
  const [exists] = await db.query(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (exists.length > 0) {
    const err = new Error("Email already exists");
    err.statusCode = 409;
    throw err;
  }

  // 2) Hashear password
  const passwordHash = await bcrypt.hash(password, 10);

  // 3) Insertar
  const id = randomUUID();
  await db.query(
    `INSERT INTO users (id, name, email, password_hash, status)
     VALUES (?, ?, ?, ?, 'active')`,
    [id, name, email, passwordHash]
  );

  return { id, name, email };
}
