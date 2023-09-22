import db from "../db/db";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export const getUserDetails = async (id: number): Promise<User> => {
  const userDetails = await db
    .select("first_name", "last_name", "email")
    .from("users")
    .where("id", id);

  return { id, ...userDetails[0] };
};

class UserService {
  static createUser = async (newUser: Object): Promise<User> => {
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
