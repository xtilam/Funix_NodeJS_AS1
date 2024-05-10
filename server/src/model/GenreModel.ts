import path from "path";
import { JSONWriteQuere } from "../utils/JSONSync";
import { CONFIGS } from "../common/configs";
import { ModelData } from "../shared/@types/Models";

const quere = new JSONWriteQuere(
  path.join(CONFIGS.DATA_DIR, "genreList.json"),
  [] as ModelData.Genre[]
);

export class GenreModel {
  static all() {
    return quere.get();
  }
  static findById(id: number) {
    return quere.get().then((list) => list.find((genre) => genre.id === id));
  }
}
