import { movieGenre } from "../common/constants";
import { ModelData } from "../shared/@types/Models";
import { RestAPIData } from "../shared/@types/RestAPI";
import { apiUrls } from "../shared/api-url";
import { axiosClient } from "./axios-client";

const getAuth = (token: string): Promise<{ user: ModelData.UserToken }> => {
  return axiosClient.get(apiUrls.auth.getAuthUser(token));
};
const movieWithGenre = (genreId: number): Promise<PaginationMovie> => {
  return axiosClient.get(apiUrls.movies.discover, {
    params: { genre: genreId },
  });
};
const findVideoMovie = (
  movieId: number
): Promise<ModelData.MovieTrailerVideo> => {
  return axiosClient.post(apiUrls.movies.video, { film_id: movieId });
};
const movieTrending = (): Promise<PaginationMovie> => {
  return axiosClient.get(apiUrls.movies.trending);
};
const movieTopRated = (): Promise<PaginationMovie> => {
  return axiosClient.get(apiUrls.movies.topRate);
};
const searchMovie = (data: SearchRequestParams): Promise<PaginationMovie> => {
  return axiosClient.post(apiUrls.movies.search, data);
};

const movieAction = () => movieWithGenre(movieGenre.action);
const movieHorror = () => movieWithGenre(movieGenre.horror);
const movieComedy = () => movieWithGenre(movieGenre.comedy);
const movieRomance = () => movieWithGenre(movieGenre.romance);
const movieDocumentaries = () => movieWithGenre(movieGenre.documentaries);

// ----------------------------------------------
export const appAPI = {
  getAuth,
  movieTopRated,
  movieComedy,
  movieDocumentaries,
  movieAction,
  movieHorror,
  movieTrending,
  movieRomance,
  findVideoMovie,
  searchMovie,
};

// ----------------------------------------------
type PaginationMovie = RestAPIData.Pagination<ModelData.Movie>;
type SearchRequestParams = {
  keyword: string;
  genre?: number;
  mediaType?: string;
  language?: string;
  year?: number;
};
