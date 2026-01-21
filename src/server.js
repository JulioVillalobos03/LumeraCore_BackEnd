import "dotenv/config";
import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
     console.log("PORT:", env.port);
    console.log("JWT_SECRET:", env.jwt.secret ? "OK" : "MISSING");
    console.log(`Server running on port ${env.port}`);
});

// en routes o directamente en server.js
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1");
    res.json({ ok: true, rows });
  } catch (error) {
    console.error("DB TEST ERROR:", error);
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});
