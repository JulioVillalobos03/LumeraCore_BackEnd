export const requireRole = (roleName) => {
  return (req, res, next) => {
    const role = req.companyUser?.role_name;

    if (!role) {
      return res.status(403).json({
        message: 'Role not assigned to user',
      });
    }

    if (role !== roleName) {
      return res.status(403).json({
        message: `Requires ${roleName} role`,
      });
    }

    next();
  };
};
