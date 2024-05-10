import path from "path";
import { JSONWriteQuere } from "../utils/JSONSync";
import { CONFIGS } from "../common/configs";
import { ModelData } from "../shared/@types/Models";

const quere = new JSONWriteQuere(
  path.join(CONFIGS.DATA_DIR, "userToken.json"),
  [] as ModelData.UserToken[]
);

export class UserTokenModel {
  static all() {
    return quere.get();
  }
  static getUser(token: string) {
    return this.all().then((list) => list.find((user) => user.token === token));
  }
}
