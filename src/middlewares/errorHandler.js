export function errorHandler (err, req, res, next) {
    console.error(err.stack);

    const status = err.status || 500;

    res.status(status).json({
        ok: false,
        message: err.message || "Internal server error", 
    });
}