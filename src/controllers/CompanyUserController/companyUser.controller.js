import {
  assignUserToCompany,
  getCompanyUsers,
  getUsersByCompany,
  updateCompanyUserStatus,
} from "../../services/CompanyUserService/companyUser.service.js";

/**
 * POST /company-users
 */
export async function assign(req, res) {
  const { userId, companyId } = req.body;

  if (!userId || !companyId) {
    return res.status(400).json({
      message: "userId and companyId are required",
    });
  }

  await assignUserToCompany({ userId, companyId });

  res.status(201).json({
    message: "User assigned to company",
  });
}

/**
 * GET /company-users/:companyId
 */
export async function list(req, res) {
  const { companyId } = req.params;

  const users = await getUsersByCompany(companyId);

  res.json({ users });
}

/**
 * PATCH /company-users/:id/status
 */
export async function changeStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }

  await updateCompanyUserStatus({ id, status });

  res.json({ message: "Company user status updated" });
}
