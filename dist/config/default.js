"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    port: process.env.PORT ?? 3000,
    NODE_ENV: process.env.NODE_ENV,
    prefix: process.env.API_PREFIX,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PROD_HOST: process.env.DB_PROD_HOST,
    DB_PROD_USER: process.env.DB_PROD_USER,
    DB_PROD_PASSWORD: process.env.DB_PROD_PASSWORD,
    accessTokenTtl: process.env.ACCESS_TOKEN_TTL,
    refreshTokenTtl: process.env.REFRESH_TOKEN_TTL,
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
    cookieExpires: process.env.JWT_COOKIE_EXPIRES_IN,
};
