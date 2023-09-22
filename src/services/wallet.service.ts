import db from "../db/db";
import generateAccountNumber from "../utils/generateAccountNumber";

interface Wallet {
  id: number;
  account_number: string;
  balance: number;
}

export const getWalletDetails = async (id: number): Promise<Wallet> => {
  const walletDetails = await db
    .select("account_number", "balance")
    .from("wallets")
    .where("id", id);

  return { id, ...walletDetails[0] };
};

class WalletService {
  static createWallet = async (
    userId: number
  ): Promise<{ account_number: string; balance: number }> => {
    const walletData = {
      user_id: userId,
      account_number: generateAccountNumber(),
    };
    const [id] = await db("wallets").insert(walletData);

    const walletDetails = await getWalletDetails(id);

    return walletDetails;
  };

  static fundWallet = async (userId: number, amount: number): Promise<void> => {
    await db
      .from("wallets")
      .where("user_id", userId)
      .increment("balance", amount);
  };
}

export default WalletService;
