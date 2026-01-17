import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function authMiddleware(req, res, next) {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            ok: false,
            message: "Missing or invalid authorization header",
        });
    }

    const token = authHeader.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, env.jwt.secret);

        req.user = {
            id: decoded.userId,
            email: decoded.email,
        };
        next();
    } catch (err) {
        res.status(401).json({
            ok: false,
            message: "Invalid or expired token",
        });
    }
}