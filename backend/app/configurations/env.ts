export const config = {
  app: {
    port: Number(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || "development",
  },
  jwt: {
    secret: process.env.JWT_ACCESS_SECRET || "",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
  bcrypt: {
    saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  },
  email: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
};
