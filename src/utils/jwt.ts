import { SignOptions, sign, verify } from "jsonwebtoken";
import config from "config";

export const signToken = (
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: SignOptions | undefined
) => {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");

  return sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

export const verifyToken = <U>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): U | null => {
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
    "ascii"
  );

  try {
    const decoded = verify(token, publicKey) as U;

    return decoded;
  } catch (e) {
    return null;
  }
};
