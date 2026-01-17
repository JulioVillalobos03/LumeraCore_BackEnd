import { createUser } from "../../services/AuthService/user.service.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      ok: false,
      message: "name, email and password are required",
    });
  }

  const user = await createUser({ name, email, password });

  return res.status(201).json({
    ok: true,
    message: "User created",
    user,
  });
}
