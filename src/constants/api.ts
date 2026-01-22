// TMDB API Configuration
// Đăng ký API key miễn phí tại https://www.themoviedb.org/settings/api
export const API_KEY = "YOUR_TMDB_API_KEY_HERE";
export const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const ENDPOINTS = {
  POPULAR: "/movie/popular",
  TOP_RATED: "/movie/top_rated",
  NOW_PLAYING: "/movie/now_playing",
  UPCOMING: "/movie/upcoming",
  SEARCH: "/search/movie",
  MOVIE_DETAIL: "/movie",
} as const;
