import { ERROR_CODES } from "../config/errorCodes.js";

export function errorMiddleware(err, req, res, next) {
  console.error(err);

  if (err.code && ERROR_CODES[err.code]) {
    const { status, message } = ERROR_CODES[err.code];

    return res.status(status).json({
      ok: false,
      code: err.code,
      message,
    });
  }

  return res.status(500).json({
    ok: false,
    code: "INTERNAL_ERROR",
    message: ERROR_CODES.INTERNAL_ERROR.message,
  });
}
