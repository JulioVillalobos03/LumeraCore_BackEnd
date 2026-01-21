export function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const status = err.status || 500;

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    stack: err.stack, // SOLO PARA DEBUG
  });
}
