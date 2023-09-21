export default {
  port: process.env.PORT ?? 3000,
  NODE_ENV: process.env.NODE_ENV,
  prefix: process.env.API_PREFIX,

  accessTokenTtl: process.env.ACCESS_TOKEN_TTL,
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,

  cookieExpires: process.env.JWT_COOKIE_EXPIRES_IN,
};
