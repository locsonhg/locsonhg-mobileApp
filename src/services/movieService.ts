import axios from "axios";
import { BASE_URL, API_KEY, ENDPOINTS } from "../constants/api";
import { MoviesResponse, MovieDetail } from "../types";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "vi-VN",
  },
});

export const movieService = {
  // Lấy danh sách phim phổ biến
  getPopularMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await api.get<MoviesResponse>(ENDPOINTS.POPULAR, {
      params: { page },
    });
    return response.data;
  },

  // Lấy danh sách phim đang chiếu
  getNowPlayingMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await api.get<MoviesResponse>(ENDPOINTS.NOW_PLAYING, {
      params: { page },
    });
    return response.data;
  },

  // Lấy danh sách phim đánh giá cao
  getTopRatedMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await api.get<MoviesResponse>(ENDPOINTS.TOP_RATED, {
      params: { page },
    });
    return response.data;
  },

  // Lấy chi tiết phim
  getMovieDetail: async (movieId: number): Promise<MovieDetail> => {
    const response = await api.get<MovieDetail>(
      `${ENDPOINTS.MOVIE_DETAIL}/${movieId}`,
    );
    return response.data;
  },

  // Tìm kiếm phim
  searchMovies: async (
    query: string,
    page: number = 1,
  ): Promise<MoviesResponse> => {
    const response = await api.get<MoviesResponse>(ENDPOINTS.SEARCH, {
      params: { query, page },
    });
    return response.data;
  },
};
