import "dotenv/config";
import config from "config";
import app from "./src/app";
import log from "./src/utils/logger";

const port = config.get<number>("port");

app.listen(port, () => {
  log.info(`App is listening at http://localhost:${port}`);
});
