/**
 * React Query Hooks for OPhim API
 */

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ophimService } from "../services/ophimService";
import {
  HomeData,
  MovieListData,
  SearchData,
  FilterListData,
  MovieDetailData,
  MovieImagesData,
  MoviePeoplesData,
  MovieKeywordsData,
  MovieListQueryParams,
  SearchQueryParams,
} from "../types/ophim";
import { OPHIM_QUERY_KEYS, CACHE_TIME } from "../constants/queryKeys";

// ==================== HOME ====================

/**
 * Hook lấy dữ liệu trang chủ
 */
export const useHome = (): UseQueryResult<HomeData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.home(),
    queryFn: async () => {
      const response = await ophimService.getHome();
      return response.data;
    },
    staleTime: CACHE_TIME.HOME,
  });
};

// ==================== MOVIE LIST ====================

/**
 * Hook lấy danh sách phim theo slug
 */
export const useMovieList = (
  slug: string,
  params?: MovieListQueryParams,
): UseQueryResult<MovieListData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.movieList(slug, params),
    queryFn: async () => {
      const response = await ophimService.getMovieList(slug, params);
      return response.data;
    },
    staleTime: CACHE_TIME.MOVIE_LIST,
  });
};

// ==================== SEARCH ====================

/**
 * Hook tìm kiếm phim
 */
export const useSearchMovies = (
  params: SearchQueryParams,
): UseQueryResult<SearchData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.search(params),
    queryFn: async () => {
      const response = await ophimService.searchMovies(params);
      return response.data;
    },
    enabled: params.keyword.length >= 2,
    staleTime: CACHE_TIME.SEARCH,
  });
};

// ==================== CATEGORY ====================

/**
 * Hook lấy danh sách thể loại
 */
export const useCategories = (): UseQueryResult<FilterListData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.categories(),
    queryFn: async () => {
      const response = await ophimService.getCategories();
      return response.data;
    },
    staleTime: CACHE_TIME.FILTERS,
  });
};

/**
 * Hook lấy phim theo thể loại
 */
export const useMoviesByCategory = (
  slug: string,
  params?: MovieListQueryParams,
): UseQueryResult<MovieListData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.categoryMovies(slug, params),
    queryFn: async () => {
      const response = await ophimService.getMoviesByCategory(slug, params);
      return response.data;
    },
    staleTime: CACHE_TIME.MOVIE_LIST,
  });
};

// ==================== COUNTRY ====================

/**
 * Hook lấy danh sách quốc gia
 */
export const useCountries = (): UseQueryResult<FilterListData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.countries(),
    queryFn: async () => {
      const response = await ophimService.getCountries();
      return response.data;
    },
    staleTime: CACHE_TIME.FILTERS,
  });
};

/**
 * Hook lấy phim theo quốc gia
 */
export const useMoviesByCountry = (
  slug: string,
  params?: MovieListQueryParams,
): UseQueryResult<MovieListData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.countryMovies(slug, params),
    queryFn: async () => {
      const response = await ophimService.getMoviesByCountry(slug, params);
      return response.data;
    },
    staleTime: CACHE_TIME.MOVIE_LIST,
  });
};

// ==================== YEAR ====================

/**
 * Hook lấy danh sách năm
 */
export const useYears = (): UseQueryResult<FilterListData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.years(),
    queryFn: async () => {
      const response = await ophimService.getYears();
      return response.data;
    },
    staleTime: CACHE_TIME.FILTERS,
  });
};

/**
 * Hook lấy phim theo năm
 */
export const useMoviesByYear = (
  year: number,
  params?: Omit<MovieListQueryParams, "year">,
): UseQueryResult<MovieListData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.yearMovies(year, params),
    queryFn: async () => {
      const response = await ophimService.getMoviesByYear(year, params);
      return response.data;
    },
    staleTime: CACHE_TIME.MOVIE_LIST,
  });
};

// ==================== MOVIE DETAIL ====================

/**
 * Hook lấy chi tiết phim
 */
export const useMovieDetail = (
  slug: string,
): UseQueryResult<MovieDetailData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.movieDetail(slug),
    queryFn: async () => {
      const response = await ophimService.getMovieDetail(slug);
      return response.data;
    },
    enabled: !!slug,
    staleTime: CACHE_TIME.MOVIE_DETAIL,
  });
};

/**
 * Hook lấy hình ảnh phim
 */
export const useMovieImages = (
  slug: string,
): UseQueryResult<MovieImagesData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.movieImages(slug),
    queryFn: async () => {
      const response = await ophimService.getMovieImages(slug);
      return response.data;
    },
    enabled: !!slug,
    staleTime: CACHE_TIME.MOVIE_IMAGES,
  });
};

/**
 * Hook lấy thông tin diễn viên
 */
export const useMoviePeoples = (
  slug: string,
): UseQueryResult<MoviePeoplesData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.moviePeoples(slug),
    queryFn: async () => {
      const response = await ophimService.getMoviePeoples(slug);
      return response.data;
    },
    enabled: !!slug,
    staleTime: CACHE_TIME.MOVIE_PEOPLES,
  });
};

/**
 * Hook lấy từ khoá phim
 */
export const useMovieKeywords = (
  slug: string,
): UseQueryResult<MovieKeywordsData, Error> => {
  return useQuery({
    queryKey: OPHIM_QUERY_KEYS.movieKeywords(slug),
    queryFn: async () => {
      const response = await ophimService.getMovieKeywords(slug);
      return response.data;
    },
    enabled: !!slug,
    staleTime: CACHE_TIME.MOVIE_KEYWORDS,
  });
};
