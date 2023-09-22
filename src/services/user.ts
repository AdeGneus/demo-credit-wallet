import db from "../db/db";

export const getUserDetails = async (id: number): Promise<Object> => {
  const userDetails = await db
    .select("first_name", "last_name", "email", "account_number", "balance")
    .from("users")
    .where("id", id);

  return { id, ...userDetails[0] };
};
class UserService {
  static createUser = async (newUser: Object): Promise<Object> => {
    const [id] = await db("users").insert(newUser);

    const userDetails = await getUserDetails(id);
    return userDetails;
  };

  static checkUser = async (email: string) => {
    const user = await db
      .select("id", "password")
      .from("users")
      .where("email", email);

    return { ...user[0] };
  };
}

export default UserService;
