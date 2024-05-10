import path from "path";
import { CONFIGS } from "../common/configs";
import { JSONWriteQuere } from "../utils/JSONSync";
import { utils } from "../utils/utils";
import { MovieModel } from "./MovieModel";

const quere = new JSONWriteQuere(
  path.join(CONFIGS.DATA_DIR, "moviesTopRateSort.json"),
  [] as { idx: number; vote_avg: number; vote_count: number }[]
);

/**
 * Cache sort top rate 
 * => nếu movie data thay đổi thì gọi vào updateVotingLate 
 * => Nhưng trong bài không có update file movies.json :)
 */
export class MovieTopRateSort {
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
              .map(
                (movie, index) =>
                  [movie.vote_average, movie.vote_count, index] as const
              )
              .sort(([vote1], [vote2]) => {
                return vote2 - vote1;
              })
              .map(([vote_avg, vote_count, idx]) => ({
                idx,
                vote_avg,
                vote_count,
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
      const topRate = await quere.get();
      if (this._lastTimeUpdateMovieModel !== MovieModel.lastTimeUpdate)
        continue;
      return { movies, topRate };
    }
  }
}
