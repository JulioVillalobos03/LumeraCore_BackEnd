
export const env = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || "srv1624.hstgr.io",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "u608641600_lumera_core",
    password: process.env.DB_PASSWORD || "LumeraCoreDB26@",
    name: process.env.DB_NAME || "u608641600_LUMERA_Core",
  },

  jwt: {
    secret: process.env.JWT_SECRET || lumera_super_secret_key,
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
};
