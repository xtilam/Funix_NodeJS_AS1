import { Router } from "express";
import { movieController } from "../controllers/movie-controller";
import { authMiddware } from "../middleware/auth-middleware";
import { apiUrls } from "../shared/api-url";

const router = Router();
const handlers = movieController.handlers;
// ----------------------------------------------

router.use("/movies", authMiddware);
router.get(apiUrls.movies.trending, handlers.trending);
router.get(apiUrls.movies.topRate, handlers.topRate);
router.get(apiUrls.movies.discover, handlers.discover);
router.post(apiUrls.movies.video, handlers.trailerMovie);
router.post(apiUrls.movies.search, handlers.searchMovie);

// ----------------------------------------------
export { router as movieRouter };
