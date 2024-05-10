import { useEffect, useRef, useState } from "react";
import { ModelData } from "../../shared/@types/Models";
import { twJoin } from "tailwind-merge";
import { appAPI } from "../../api/appAPI";

const css = {} as any;

export default function MovieDetail({
  movie,
  fixed,
  onClose,
}: MovieDetailProps) {
  const [youtubeSite, setYoutubeSite] = useState("");
  const detailEl = useRef<HTMLDivElement>();

  const loadMovie = async () => {
    if (!movie) return;
    const [resp, error] = await appAPI.findVideoMovie(movie.id).safe();
    if (error) return;
    setYoutubeSite(resp.key);
  };

  useEffect(() => {
    setYoutubeSite("");
    loadMovie();
    if (!movie || fixed) return;
    setTimeout(() => {
      const screenHeight = document.documentElement.clientHeight;
      if (!detailEl.current) return;

      const { offsetTop, clientHeight } = detailEl.current;
      const bottomPos = offsetTop + clientHeight + 200;

      if (bottomPos < screenHeight) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: bottomPos - screenHeight, behavior: "smooth" });
      }
    });
  }, [movie]);

  useEffect(() => {
    let isRemoved = false;
    const closeEvent = () => onClose && onClose();

    setTimeout(() => {
      if (isRemoved) return;
      document.addEventListener("click", closeEvent);
    });

    return () => {
      isRemoved = true;
      document.removeEventListener("click", closeEvent);
    };
  }, [movie, onClose]);

  if (!movie) return;

  return (
    <div
      ref={detailEl}
      className={twJoin(
        "grid w-full grid-cols-2 items-start px-4 py-8 gap-4 ",
        fixed && "sticky bottom-0 w-full bg-black"
      )}
      onClick={(evt) => {
        evt.stopPropagation();
      }}
    >
      <div className="grid gap-4">
        <h2 className="normal-case text-3xl font-bold">{movie.title}</h2>
        <div>
          <h4 className="normal-case">Release Date: {movie.release_date}</h4>
          <h4 className="normal-case">Vote: {movie.vote_average} / 10</h4>
        </div>
        <div>{movie.overview}</div>
      </div>
      <div className="h-[400px]">
        {youtubeSite ? (
          <iframe
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${youtubeSite}`}
          ></iframe>
        ) : (
          <img
            className="object-cover rounded-lg"
            src={`https://image.tmdb.org/t/p/w780/${
              movie.backdrop_path || movie.poster_path
            }`}
            alt={movie.title}
          ></img>
        )}
      </div>
    </div>
  );
}

type MovieDetailProps = {
  movie: ModelData.Movie;
  fixed?: boolean;
  onClose?: () => any;
};
