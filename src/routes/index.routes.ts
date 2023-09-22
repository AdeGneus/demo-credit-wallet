import { Router } from "express";
import auth from "./auth.routes";
import wallet from "./wallet.routes";

const routes = Router();

routes.use("/auth", auth);
routes.use("/wallets", wallet);

export default routes;
