import {
  RestController,
  RestControllerAsyncHandler,
} from "../core/RestController";
import { UserTokenModel } from "../model/UserTokenModel";

// ----------------------------------------------
// Handlers
const getAuthUser: RestControllerAsyncHandler = async (req, _res) => {
  // ----------------------------------------------
  const token = req.params.token?.trim();
  if (!token) return {};
  return { user: await UserTokenModel.getUser(token) };
};

// ----------------------------------------------
export const authController = new RestController().addAsyncHandlerFromObject({
  getAuthUser,
});
