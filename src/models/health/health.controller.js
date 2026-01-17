import { db } from '../../config/db.js';

export async function healthCheck(req, res) {
    const [rows] = await db.query('SELECT 1 as ok');

    res.json({
        ok: true,
        db: rows?.[0]?.ok === 1 ? "connected" : "uknown", 
        timestamp: new Date().toISOString(),
    });
}