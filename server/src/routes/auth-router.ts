import { Router } from "express";
import { authController } from "../controllers/auth-controller";
import { apiUrls } from "../shared/api-url";

const router = Router();
const handlers = authController.handlers;
// ----------------------------------------------

router.get(apiUrls.auth.getAuthUser(), handlers.getAuthUser);

// ----------------------------------------------
export { router as authRouter };
