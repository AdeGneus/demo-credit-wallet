import db from "../db/db";

class UserService {
  static createUser = async (newUser: Object) => {
    const [id] = await db("users").insert(newUser);

    const userDetails = await db
      .select("first_name", "last_name", "email", "account_number")
      .from("users")
      .where("id", id);

    return { id, ...userDetails[0] };
  };
}

export default UserService;
