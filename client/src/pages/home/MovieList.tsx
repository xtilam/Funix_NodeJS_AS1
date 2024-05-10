import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { ModelData } from "../../shared/@types/Models";
import { RestAPIData } from "../../shared/@types/RestAPI";
import MovieDetail from "./MovieDetail";
import { twJoin } from "tailwind-merge";

const css = {} as any;
export const MovieList = ({ title, fetch, usePoster }: MovieListProps) => {
  const [fetchMovies, isLoadding, error] = useFetch(fetch);
  const [movies, setMovies] = useState<ModelData.Movie[]>([]);
  const [movieDetail, setMovieDetail] = useState<ModelData.Movie>(null);
  const [closeMovie, setCloseMovie] = useState<ModelData.Movie>(null);

  const loadMovies = async () => {
    if (isLoadding) return;
    const [resp, error] = await fetchMovies().safe();
    if (error) return;
    setMovies(resp.results);
  };

  // load movies
  useEffect(() => {
    loadMovies();
  }, []);

  // close detail movie
  useEffect(() => {
    if (!movieDetail) return;
    if (!closeMovie) return;
    if (closeMovie !== movieDetail) return;
    setCloseMovie(null);
    setMovieDetail(null);
  }, [closeMovie, movieDetail]);

  const pathCheck = [
    ["backdrop_path", `https://image.tmdb.org/t/p/w300/`],
    ["poster_path", `https://image.tmdb.org/t/p/w342/`],
  ];
  // đổi sang check poster trước
  if (usePoster) pathCheck.push(pathCheck.shift());

  const getImage = (movie: ModelData.Movie) => {
    let url = "";
    for (const [property, preUrl] of pathCheck) {
      const imgPath = movie[property];
      if (!imgPath) continue;
      url = preUrl + imgPath;
      break;
    }

    return <img src={url} alt={movie.title} className="w-full h-full" />;
  };

  const movieClickHandler = (movie: ModelData.Movie) => {
    setMovieDetail(movie === movieDetail ? null : movie);
    setCloseMovie(null);
  };

  const movieDetailCloseHandler = () => {
    setCloseMovie(movieDetail);
  };

  return (
    <div className="pt-8 m-4 grid gap-2">
      {title && (
        <h3 className="text-2xl flex gap-2 items-center">
          {title}
          {isLoadding && (
            <div className="loader inline-block text-primary"></div>
          )}
        </h3>
      )}
      {(() => {
        if (isLoadding) return <></>;
        if (error)
          return (
            <div>
              <h3>Something went wrong!</h3>
              <button onClick={loadMovies}>Reload</button>
            </div>
          );

        return (
          <ul
            className={twJoin(
              "flex gap-4 overflow-x-auto overflow-y-hidden h-full black-scroll pb-2",
              usePoster && css.poster
            )}
          >
            {movies.map((movie) => {
              return (
                <li
                  key={movie.id}
                  style={{ flex: "0 0 200px" }}
                  className="h-full"
                  onClick={() => movieClickHandler(movie)}
                >
                  {getImage(movie)}
                </li>
              );
            })}
          </ul>
        );
      })()}
      {movieDetail && (
        <MovieDetail movie={movieDetail} onClose={movieDetailCloseHandler} />
      )}
    </div>
  );
};

type MovieListProps = {
  title?: string;
  usePoster?: boolean;
  fetch: () => Promise<RestAPIData.Pagination<ModelData.Movie>>;
};
