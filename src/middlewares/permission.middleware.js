import * as PermissionService from "../services/PermissionService/permission.service.js";

export function requirePermission(permission) {
  return async (req, res, next) => {
    const userId = req.user.id;
    const companyId = req.company.id;

    const permissions = await PermissionService.getPermissionsByUser({
      userId,
      companyId
    });

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: "Permission denied"
      });
    }

    next();
  };
}
