import path from "path";
import { CONFIGS } from "../common/configs";
import { ModelData } from "../shared/@types/Models";
import { JSONWriteQuere } from "../utils/JSONSync";

const quere = new JSONWriteQuere(
  path.join(CONFIGS.DATA_DIR, "videoList.json"),
  [] as ModelData.MovieTrailer[]
);

export class MovieTrailerModel {
  static all() {
    return quere.get();
  }
  static findByFilmId(id: number) {
    return this.all().then((list) => list.find((film) => film.id === id));
  }
}
