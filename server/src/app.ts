import "./setup";
import "./utils/promise-utils";

import bodyParser from "body-parser";
import cors from "cors";
import express, { RequestHandler } from "express";
import { CONFIGS } from "./common/configs";
import { MovieTopRateSort } from "./model/MovieTopRateSort";
import { authRouter } from "./routes/auth-router";
import { movieRouter } from "./routes/movie-router";
import { MovieTrendingSort } from "./model/MovieTrendingSort";

const main = async () => {
  await MovieTopRateSort.updateLate();
  await MovieTrendingSort.updateLate();

  const app = express();
  app.use(express.static(CONFIGS.PUBLIC_DIR));
  if (CONFIGS.IS_DEV) app.use(cors({ origin: "*" }));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use("/api", authRouter);
  app.use("/api", movieRouter);

  app.use("/api", notFoundHandler);
  app.listen(CONFIGS.SERVER_PORT, () => {
    console.log(`server start: ${CONFIGS.SERVER_PORT}`);
  });
};

const notFoundHandler: RequestHandler = (_req, res) =>
  res.status(404).json({ message: "Route not found" });

main();
