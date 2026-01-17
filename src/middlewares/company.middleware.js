import { db } from "../config/db.js";

export const companyMiddleware = async (req, res, next) => {
  const companyId = req.headers['x-company-id'];

  if (!companyId) {
    return res.status(400).json({ message: 'Company ID header missing' });
  }

  const userId = req.user.id;

  const [rows] = await db.query(
    `
    SELECT 
    cu.id,
    cu.status,
    r.name AS role_name
    FROM company_users cu
    LEFT JOIN roles r ON r.id = cu.role_id
    WHERE cu.user_id = ? 
    AND cu.company_id = ? 
    AND cu.status = 'active'
    `,
    [userId, companyId]
  );

  if (rows.length === 0) {
    return res.status(403).json({
      message: 'User does not belong to this company',
    });
  }

  
  req.company = { id: companyId };
  req.companyUser = rows[0];

  next();
};
