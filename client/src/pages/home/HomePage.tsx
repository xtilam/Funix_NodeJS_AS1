import { Navigate } from "react-router-dom";
import { pageURL } from "../../common/url";
import Banner from "./Banner";
import { useAppSelector } from "../../store";
import { appAPI } from "../../api/appAPI";
import { MovieList } from "./MovieList";

export const HomePage = () => {
  const user = useAppSelector((store) => store.auth.user);

  if (!user) return <Navigate to={pageURL.login} />;

  return (
    <>
      <Banner />
      <MovieList title="Xu hướng" fetch={appAPI.movieTrending} />
      <MovieList title="Xếp hạng cao" fetch={appAPI.movieTopRated} />
      <MovieList title="Hành động" fetch={appAPI.movieAction} />
      <MovieList title="Hài" fetch={appAPI.movieComedy} />
      <MovieList title="Kinh dị" fetch={appAPI.movieHorror} />
      <MovieList title="Lãng mạn" fetch={appAPI.movieRomance} />
      <MovieList title="Tài liệu" fetch={appAPI.movieDocumentaries} />
    </>
  );
};
