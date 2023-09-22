import { verify } from "argon2";

export const isCorrectPassword = async (
  userPassword: string,
  candidatePassword: string
): Promise<boolean> => {
  return await verify(userPassword, candidatePassword);
};
