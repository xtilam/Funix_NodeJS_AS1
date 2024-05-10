import { useEffect, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { utils } from "../../utils/utils";
import { ModelData } from "../../shared/@types/Models";
import { appAPI } from "../../api/appAPI";

const MAX_CHARACTER_OVERVIEW = 300;

export default function Banner() {
  const [movies, setMovies] = useState<ModelData.Movie[]>([]);
  const [movieShowIdx, setMovieShowIdx] = useState(0);
  const [getMovies, isLoadding, error] = useFetch(appAPI.movieTrending);

  const loadMovies = async () => {
    const [resp, error] = await getMovies().safe();
    if (error) return;
    setMovies(resp.results);
  };

  // load movies
  useEffect(() => {
    // utils.delay(8000).then(loadMovies);
    loadMovies();
  }, []);

  // change movies
  useEffect(() => {
    let isStoped = false;

    const runChangeMovie = async () => {
      let oldMovieIdx = 0;
      const lastMovieIdx = movies.length - 1;
      console.log({ movies });
      if (0 > lastMovieIdx) return;

      while (!isStoped) {
        const newIdx = utils.random(0, lastMovieIdx);
        if (newIdx === oldMovieIdx) continue;
        oldMovieIdx = newIdx;
        setMovieShowIdx(newIdx);
        await utils.delay(8000);
      }
    };

    runChangeMovie();

    return () => ((isStoped = true), null);
  }, [movies]);

  return (
    <div className="h-[500px] relative text-white">
      {(() => {
        if (error)
          return (
            <div className="text-danger">
              <h2>Something when wrong!</h2>
              <button onClick={loadMovies}>Reload</button>
            </div>
          );

        if (isLoadding)
          return (
            <div className="text-white absolute left-1/2 top-1/2 -translate-x-1/2">
              <h2 className="loader text-5xl"></h2>
            </div>
          );

        const movie = movies[movieShowIdx];
        if (!movie) return;

        const movieButton = (text) => (
          <button className="!normal-case rounded-[4px] btn-secondary">
            {text}
          </button>
        );

        return (
          <>
            <img
              className="absolute top-0 left-0 object-cover w-full h-full"
              src={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`}
              alt={movie.name}
            />
            <div className="w-full h-full bg-[#0000004d] absolute top-0 left-0"></div>
            <div className="top-[40%] -translate-y-1/2 max-w-[600px] px-4 absolute grid gap-4">
              <h2 className="text-3xl normal-case font-bold">
                {movie.title || movie.name}
              </h2>
              <div className="flex gap-3">
                {movieButton("Play")}
                {movieButton("My List")}
              </div>
              <div className="font-bold text-sm">
                {movie.overview?.length <= MAX_CHARACTER_OVERVIEW
                  ? movie.overview
                  : movie.overview.slice(0, MAX_CHARACTER_OVERVIEW) + "..."}
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
