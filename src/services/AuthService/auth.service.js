import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../config/db.js";
import { env } from "../../config/env.js";

export async function loginUser(email, password) {
    const [rows] = await db.query(
        `SELECT id, name, email, password_hash, status 
        From users
        WHERE email = ?
        LIMIT 1`,
        [email]
    );

    if (rows.length === 0) {
        throw new Error("Invalid credentials");
    }
     
    const user = rows[0];

    if (user.status !== "active") {
        throw new Error("User is inactive");
    }
 
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        {
            userId: user.id,
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