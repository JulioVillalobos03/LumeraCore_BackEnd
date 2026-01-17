import * as RoleService from "../../services/RoleService/role.service.js";

/**
 * POST /roles
 */
export async function create(req, res) {
  const { name } = req.body;
  const companyId = req.company.id;

  if (!name) {
    return res.status(400).json({
      message: "Role name is required",
    });
  }

  const role = await RoleService.createRole({ name, companyId });

  res.status(201).json({
    message: "Role created",
    role,
  });
}

/**
 * GET /roles
 */
export async function list(req, res) {
  const companyId = req.company.id;

  const roles = await RoleService.getRolesByCompany(companyId);

  res.json({ 
    ok: true,
    data: roles,
   });
}

/**
 * PATCH /roles/assign
 */
export async function assign(req, res) {
  const { companyUserId, roleId } = req.body;

  if (!companyUserId || !roleId) {
    return res.status(400).json({
      message: "companyUserId and roleId are required",
    });
  }

  await RoleService.assignRoleToUser({ companyUserId, roleId });

  res.json({
    message: "Role assigned to user",
  });
}
