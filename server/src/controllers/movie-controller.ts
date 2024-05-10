import { RestController } from "../core/RestController";
import { GenreModel } from "../model/GenreModel";
import { MovieModel } from "../model/MovieModel";
import { MovieTopRateSort } from "../model/MovieTopRateSort";
import { MovieTrailerModel } from "../model/MovieTrailerModel";
import { MovieTrendingSort } from "../model/MovieTrendingSort";
import { ModelData } from "../shared/@types/Models";

const paginationConfig = { page: 1, max: 20, limit: 20 };
const validVideoType = new Set(["Trailer", "Teaser"]);

// ----------------------------------------------
// Controller
export const movieController = new RestController()
  .async("trending", async (req, res, api) => {
    const { movies, trending } = await MovieTrendingSort.all();
    const paginationResult = api.paginationList(trending, paginationConfig);

    return Object.assign(api.paginationList(trending, paginationConfig), {
      results: paginationResult.results.map(({ idx }) => movies[idx]),
    });
  })
  .async("topRate", async (req, res, api) => {
    const { movies, topRate } = await MovieTopRateSort.all();
    const paginationResult = api.paginationList(topRate, paginationConfig);

    return Object.assign(api.paginationList(topRate, paginationConfig), {
      results: paginationResult.results.map(({ idx }) => movies[idx]),
    });
  })
  .async("discover", async (req, res, api) => {
    const genreId = api.query.number("genre", true);
    const genre = await GenreModel.findById(genreId);
    if (!genre) return api.error("Not found that gerne id", 400);

    const movies = (await MovieModel.all()).filter(
      (movie) => movie.genre_ids.findIndex((id) => id === genre.id) !== -1
    );

    return Object.assign(api.paginationList(movies, paginationConfig), {
      genre_name: genre.name,
    });
  })
  .async("trailerMovie", async (req, res, api) => {
    const notFoundVideo = () => api.error(`Not found video`, 404);
    // ----------------------------------------------
    const filmId = api.body.number("film_id", true);
    const film = await MovieTrailerModel.findByFilmId(filmId);
    if (!film) return notFoundVideo();

    const videos = film.videos.filter(
      (v) => v.official && v.site === "YouTube" && validVideoType.has(v.type)
    );

    if (videos.length === 0) return notFoundVideo();
    if (videos.length === 1) return videos[0];

    return videos.reduce(
      (lastVideo, video) => {
        const publishedTime = new Date(video.published_at).getTime();
        if (publishedTime > lastVideo.publishedTime)
          return { video, publishedTime };
        if (publishedTime) return lastVideo;
      },
      {
        video: videos[0],
        publishedTime: 0,
      }
    ).video;
  })
  .async("searchMovie", async (_req, _res, api) => {
    const getKeywordRegex = () => {
      let regexConcat = "";
      for (const char of keyword) {
        regexConcat += char === " " ? " " : `[${char}${char.toUpperCase()}]`;
      }
      return new RegExp(regexConcat);
    };
    const getListFilter = () => {
      const filters = movieSearchFilters;
      const listFilter = [];

      if (genre) listFilter.push(filters.genre.bind(0, genre));
      if (year) listFilter.push(filters.year.bind(0, year));
      if (mediaType) listFilter.push(filters.mediaType.bind(0, mediaType));
      if (language && language !== "all")
        listFilter.push(filters.language.bind(0, language));

      // Ưu tiên điều kiện khác dễ check hơn tìm keyword
      listFilter.push(filters.keyword.bind(0, regexKeyword));

      return listFilter;
    };
    // ----------------------------------------------
    const keyword = api.body.trim("keyword", true);
    const genre = api.body.number("genre");
    const mediaType = api.body.trim("mediaType");
    const language = api.body.trim("language");
    const year = api.body.number("year");

    const regexKeyword = getKeywordRegex();
    const listFilter = getListFilter();
    const movies = (await MovieModel.all()).filter((movie) => {
      for (const filter of listFilter) {
        if (!filter(movie)) return false;
      }
      return true;
    });

    return api.paginationList(movies, paginationConfig);
  });

// ----------------------------------------------
// other
const movieSearchFilters = {
  keyword: (regexKeyword, movie: ModelData.Movie) =>
    movie.name?.match(regexKeyword) || movie.overview?.match(regexKeyword),
  year: (year: number, { release_date }: ModelData.Movie) => {
    return release_date && new Date(release_date).getFullYear() === year;
  },
  genre: (genre: number, movie: ModelData.Movie) =>
    movie.genre_ids.find((id) => id === genre),
  language: (language: string, movie: ModelData.Movie) =>
    movie.original_language === language,
  mediaType: (mediaType: string, movie: ModelData.Movie) =>
    movie.media_type === mediaType,
};
