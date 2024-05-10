import path from "path";
import { CONFIGS } from "./common/configs";
import dotenv from "dotenv";
import { existsSync, mkdirSync, readFileSync } from "fs";

const setup = () => {
  const getEnvPath = () => {
    const env1 = path.join(__dirname, "./.env");
    const env2 = path.join(__dirname, "../.env");
    if (existsSync(env1)) return env1;
    if (existsSync(env2)) return env2;
    throw "Not found env file!";
  };
  // ----------------------------------------------
  Object.assign(process.env, dotenv.parse(readFileSync(getEnvPath())));

  const env = process.env;

  const appDir = (CONFIGS.APP_DIR = __dirname);
  const isDev = (CONFIGS.IS_DEV =
    env.NODE_ENV === "development" ? true : false);

  const dataDir = (CONFIGS.DATA_DIR = isDev
    ? path.join(appDir, "../data")
    : path.join("./data"));

  const publicDir = (CONFIGS.PUBLIC_DIR = isDev
    ? path.join(appDir, "../public")
    : path.join("./public"));

  CONFIGS.SERVER_PORT = env.SERVER_PORT || CONFIGS.SERVER_PORT;
  if (!existsSync(dataDir)) mkdirSync(dataDir);
  if (!existsSync(publicDir)) mkdirSync(publicDir);
};

setup();
