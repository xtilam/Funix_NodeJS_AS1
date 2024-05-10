import { RestController } from "../core/RestController";
import { UserTokenModel } from "../model/UserTokenModel";

export const authController = new RestController().async(
  "getAuthUser",
  async (req, _res) => {
    // ----------------------------------------------
    const token = req.params.token?.trim();
    if (!token) return {};
    return { user: await UserTokenModel.getUser(token) };
  }
);
