import * as AuthService from "../../services/AuthService/auth.service.js";

export async function login(req, res) {
    
    const { email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            ok: false,
            message: "Email and password are required",
        });
    }

    const response = await AuthService.loginUser(email, password);

    res.json({
        ok: true,
        token: response.token,
        user: response.user,
    });
}


export async function context(req, res) {
  // Debug rápido (temporal)
  console.log("REQ.USER =>", req.user);

  const userId = req.user.id;

  const data = await AuthService.getUserContext(userId);

  res.json({
    ok: true,
    ...data,
  });
}

