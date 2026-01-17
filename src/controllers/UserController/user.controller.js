import * as UserService from '../../services/UserService/user.service.js';
import { getUsersByCompany } from "../../services/CompanyUserService/companyUser.service.js";

/**
 * GET /users
 */
export async function list(req, res) {
  const companyId = req.company.id;

  const users = await getUsersByCompany(companyId);
  res.json({ users });
}

export const create = async (req, res) => {
  const companyId = req.company.id;
  const { name, email, password, roleId } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "name, email and password are required",
    });
  }

  const result = await UserService.createUser({
    companyId,
    name,
    email,
    password,
    roleId,
  });

  res.status(201).json({
    message: "User created successfully",
    userId: result.userId,
  });
};

/**
 * PATCH /users/:id
 */
export async function update(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "name and email are required",
    });
  }

  await UserService.updateUser({ id, name, email });

  res.json({ message: "User updated" });
}

/**
 * PATCH /users/:id/status
 */
export async function changeStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "blocked"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }

  await UserService.updateUserStatus({ id, status });

  res.json({ message: "User status updated" });
}

export async function assignRole(req, res) {
  const { userId } = req.params;
  const { roleId } = req.body;
  const companyId = req.company.id;

  await UserService.assignRole({
    userId,
    companyId,
    roleId,
  });

  res.json({ message: 'Role assigned successfully' });
};