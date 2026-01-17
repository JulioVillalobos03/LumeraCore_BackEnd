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
