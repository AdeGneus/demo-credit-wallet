"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = __importDefault(require("config"));
const app_1 = __importDefault(require("./src/app"));
const logger_1 = __importDefault(require("./src/utils/logger"));
const port = config_1.default.get("port");
app_1.default.listen(port, () => {
    logger_1.default.info(`App is listening at http://localhost:${port}`);
});
