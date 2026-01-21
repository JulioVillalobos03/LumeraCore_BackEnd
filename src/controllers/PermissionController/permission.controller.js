import * as PermissionService from "../../services/PermissionService/permission.service.js";

export async function create(req, res) {
  const { key } = req.body;

  const permission = await PermissionService.createPermission(key);

  res.status(201).json(permission);
}

export async function list(req, res) {
  const permissions = await PermissionService.getAllPermissions();

  res.json({
    ok: true,
    data: permissions,
  });
}

export async function assign(req, res) {
  const { roleId, permissionId } = req.body;

  await PermissionService.assignPermissionToRole({ roleId, permissionId });

  res.json({ message: "Permission assigned to role" });
}

export async function listByRole(req, res) {
  const { roleId } = req.params;

  if (!roleId) {
    return res.status(400).json({
      message: "roleId is required",
    });
  }

  const permissions = await PermissionService.getPermissionsByRole(roleId);

  res.json({
    ok: true,
    data: permissions,
  });
}