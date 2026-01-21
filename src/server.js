import "dotenv/config";
import app from './app.js';
import { env } from './config/env.js';
import cors from 'cors';

app.listen(env.port, () => {
     console.log("PORT:", env.port);
    console.log("JWT_SECRET:", env.jwt.secret ? "OK" : "MISSING");
    console.log(`Server running on port ${env.port}`);
});

app.use(cors({
  origin: 'https://greenyellow-pony-308023.hostingersite.com/', // Permite que tu frontend local se conecte
  credentials: true
}));

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
