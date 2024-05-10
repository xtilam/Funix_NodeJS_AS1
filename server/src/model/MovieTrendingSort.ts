import path from "path";
import { CONFIGS } from "../common/configs";
import { JSONWriteQuere } from "../utils/JSONSync";
import { utils } from "../utils/utils";
import { MovieModel } from "./MovieModel";

const quere = new JSONWriteQuere(
  path.join(CONFIGS.DATA_DIR, "moviesTrendingSort.json"),
  [] as { idx: number; popularity: number }[]
);

/**
 * Cache sort trending => copy từ MovieTopRateSort
 * => nếu movie data thay đổi thì gọi vào updateVotingLate
 * => Nhưng trong bài không có update file movies.json :)
 */
export class MovieTrendingSort {
  private static _updateLateStack = 0;
  private static _updateLatePromise: Promise<void>;
  private static _lastTimeUpdateMovieModel = 0;

  static updateLate() {
    if (this._updateLatePromise) {
      ++this._updateLateStack;
      return this._updateLatePromise;
    }

    return (this._updateLatePromise = new Promise(async (resolve) => {
      const hasNewUpdate = () => {
        if (
          curStack === this._updateLateStack &&
          lastTimeUpdateMovieModel === MovieModel.lastTimeUpdate
        )
          return false;

        lastTimeUpdateMovieModel = MovieModel.lastTimeUpdate;
        curStack = this._updateLateStack;
        return true;
      };
      // ----------------------------------------------
      let curStack = this._updateLateStack;
      let lastTimeUpdateMovieModel = MovieModel.lastTimeUpdate;

      while (true) {
        await utils.delay(100);
        if (hasNewUpdate()) continue;
        const movies = await MovieModel.all();

        let isUpdated = false;
        await quere.update((_, setData) => {
          if (hasNewUpdate()) return;
          isUpdated = true;
          setData(
            movies
              .map((movie, index) => [movie.popularity, index] as const)
              .sort(([popularity1], [popularity2]) => {
                return popularity2 - popularity1;
              })
              .map(([popularity, idx]) => ({
                idx,
                popularity,
              }))
          );
        });

        if (!isUpdated) continue;
        break;
      }

      this._lastTimeUpdateMovieModel = lastTimeUpdateMovieModel;
      resolve();
    }));
  }

  static async all() {
    while (true) {
      if (this._updateLatePromise) await this._updateLatePromise;
      const movies = await MovieModel.all();
      if (this._lastTimeUpdateMovieModel !== MovieModel.lastTimeUpdate)
        continue;
      const trending = await quere.get();
      if (this._lastTimeUpdateMovieModel !== MovieModel.lastTimeUpdate)
        continue;
      return { movies, trending };
    }
  }
}
