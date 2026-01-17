import { loginUser } from "../../services/AuthService/auth.service.js";

export async function login(req, res) {
    
    const { email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            ok: false,
            message: "Email and password are required",
        });
    }

    const response = await loginUser(email, password);

    res.json({
        ok: true,
        token: response.token,
        user: response.user,
    });
}