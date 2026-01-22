import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { movieService } from "../services/movieService";
import { MoviesResponse, MovieDetail } from "../types";

export const usePopularMovies = (
  page: number = 1,
): UseQueryResult<MoviesResponse, Error> => {
  return useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => movieService.getPopularMovies(page),
  });
};

export const useTopRatedMovies = (
  page: number = 1,
): UseQueryResult<MoviesResponse, Error> => {
  return useQuery({
    queryKey: ["movies", "topRated", page],
    queryFn: () => movieService.getTopRatedMovies(page),
  });
};

export const useNowPlayingMovies = (
  page: number = 1,
): UseQueryResult<MoviesResponse, Error> => {
  return useQuery({
    queryKey: ["movies", "nowPlaying", page],
    queryFn: () => movieService.getNowPlayingMovies(page),
  });
};

export const useMovieDetail = (
  movieId: number,
): UseQueryResult<MovieDetail, Error> => {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => movieService.getMovieDetail(movieId),
    enabled: !!movieId,
  });
};

export const useSearchMovies = (
  query: string,
  page: number = 1,
): UseQueryResult<MoviesResponse, Error> => {
  return useQuery({
    queryKey: ["movies", "search", query, page],
    queryFn: () => movieService.searchMovies(query, page),
    enabled: query.length > 0,
  });
};
