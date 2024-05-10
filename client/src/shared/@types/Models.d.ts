export namespace ModelData {
  export type Genre = {
    id: number;
    name: string;
  };
  export type Movie = {
    backdrop_path: string;
    first_air_date: string;
    genre_ids: number[];
    id: number;
    name?: string;
    title?: string;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    release_date: string;
    media_type: string;
    adult?: false;
  };
  export type MovieTrailer = {
    id: number;
    videos: MovieTrailerVideo[];
  };
  export type MovieTrailerVideo = {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: string;
  };
  export type UserToken = {
    userId: string;
    token: string;
  };
}
