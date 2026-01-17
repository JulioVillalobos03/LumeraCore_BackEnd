import { db } from "../config/db.js";

/**
 * Tenant Middleware (multiempresa)
 * Lee X-Company-Id del header y carga la empresa activa.
 */
export async function tenantMiddleware(req, res, next) {
  try {
    const companyId = req.header("X-Company-Id");

    if (!companyId) {
      return res.status(400).json({
        ok: false,
        message: "Missing header: X-Company-Id",
      });
    }

    const [rows] = await db.query(
      `SELECT id, name, status 
       FROM companies 
       WHERE id = ? 
       LIMIT 1`,
      [companyId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Company not found",
      });
    }

    const company = rows[0];

    if (company.status !== "active") {
      return res.status(403).json({
        ok: false,
        message: "Company is inactive",
      });
    }

    // Se lo pegamos al request para usarlo en controllers/services
    req.company = company;

    next();
  } catch (err) {
    next(err);
  }
}
