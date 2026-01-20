import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../config/db.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";

export async function loginUser(email, password) {
    const [rows] = await db.query(
        `SELECT id, name, email, password_hash, status 
        From users
        WHERE email = ?
        LIMIT 1`,
        [email]
    );

    if (rows.length === 0) {
        throw new AppError("AUTH_INVALID_CREDENTIALS");
    }
     
    const user = rows[0];

    if (user.status !== "active") {
        throw new AppError("AUTH_USER_INACTIVE");
    }
 
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
        throw new AppError("AUTH_INVALID_CREDENTIALS");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        env.jwt.secret,
        {
            expiresIn: env.jwt.expiresIn,
        },
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,    
            email: user.email,
        },
    };

}


export async function getUserContext(userId) {
  if (!userId) {
    throw new AppError("AUTH_TOKEN_INVALID");
  }
  const [rows] = await db.query(
    `
    SELECT
      c.id AS company_id,
      c.name AS company_name,
      cu.role_id,
      r.name AS role_name,
      cu.status
    FROM company_users cu
    JOIN companies c ON c.id = cu.company_id
    LEFT JOIN roles r ON r.id = cu.role_id
    WHERE cu.user_id = ?
      AND cu.status = 'active'
    ORDER BY c.created_at DESC
    `,
    [userId]
  );

  const hasCompany = rows.length > 0;

  return {
    hasCompany,
    companies: rows,
    activeCompany: hasCompany ? rows[0] : null,
  };
}
