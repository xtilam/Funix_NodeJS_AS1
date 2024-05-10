export const apiUrls = {
  movies: {
    trending: "/movies/trending",
    topRate: "/movies/top-rate",
    discover: "/movies/discover",
    video: "/movies/video",
    search: "/movies/search",
  },
  auth: {
    getAuthUser: (token = ":token") => `/auth/get-user/${token}`,
  },
};