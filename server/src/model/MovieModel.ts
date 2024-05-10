import path from "path";
import { JSONWriteQuere } from "../utils/JSONSync";
import { CONFIGS } from "../common/configs";
import { ModelData } from "../shared/@types/Models";

const movieQuere = new JSONWriteQuere(
  path.join(CONFIGS.DATA_DIR, "movieList.json"),
  [] as ModelData.Movie[]
);

export class MovieModel {
  static lastTimeUpdate = 0;
  static all() {
    return movieQuere.get();
  }
}
