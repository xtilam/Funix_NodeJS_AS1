import { useActionData } from "react-router-dom";
import { SearchPage } from "./SearchPage";
import { useEffect, useState } from "react";
import { ModelData } from "../../shared/@types/Models";
import MovieDetail from "../home/MovieDetail";

export const SearchResult = () => {
  const [movies] = (useActionData() as ActionResult) || [];
  const [movieDetail, setMovieDetail] = useState<ModelData.Movie>(null);
  const [closeMovie, setCloseMovie] = useState<ModelData.Movie>(null);

  // close detail movie
  useEffect(() => {
    if (!movieDetail) return;
    if (!closeMovie) return;
    if (closeMovie !== movieDetail) return;
    setCloseMovie(null);
    setMovieDetail(null);
  }, [closeMovie, movieDetail]);

  const movieClickHandler = (movie: ModelData.Movie) => {
    setMovieDetail(movie === movieDetail ? null : movie);
    setCloseMovie(null);
  };

  const movieDetailCloseHandler = () => {
    setCloseMovie(movieDetail);
  };

  if (!movies) return <></>;

  return (
    <div className="p-9 grid gap-4">
      <h3>Search Result</h3>
      {!movies?.length ? (
        <h3>No result</h3>
      ) : (
        <>
          <ul className="list-none flex flex-wrap gap-4">
            {movies.map((movie) => (
              <li
                key={movie.id}
                className="w-[150px] h-[200px] hover:scale-[1.05] duration-200"
                onClick={() => movieClickHandler(movie)}
              >
                {getImgJSX(movie)}
              </li>
            ))}
          </ul>
        </>
      )}
      {movieDetail && (
        <MovieDetail
          movie={movieDetail}
          onClose={movieDetailCloseHandler}
          fixed
        />
      )}
    </div>
  );
};

// ----------------------------------------------
// Get JSX
const getImgJSX = (movie: ModelData.Movie) => {
  const { backdrop_path, poster_path, name, title } = movie;
  const url =
    (poster_path && `https://image.tmdb.org/t/p/w342/${poster_path}`) ||
    (backdrop_path && `https://image.tmdb.org/t/p/w300/${backdrop_path}`) ||
    "";
  return (
    <img className="w-full h-full object-cover" src={url} alt={title || name} />
  );
};
// ----------------------------------------------
type ActionResult = Awaited<ReturnType<(typeof SearchPage)["action"]>>;
