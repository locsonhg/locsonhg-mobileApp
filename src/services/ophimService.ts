/**
 * OPhim API Service
 * Base URL: https://ophim1.com
 * API Version: v1
 */

import axios, { AxiosInstance } from "axios";
import {
  HomeResponse,
  MovieListResponse,
  SearchResponse,
  FilterListResponse,
  MovieDetailResponse,
  MovieImagesResponse,
  MoviePeoplesResponse,
  MovieKeywordsResponse,
  MovieListQueryParams,
  SearchQueryParams,
} from "../types/ophim";
import { OPHIM_CONFIG, OPHIM_ENDPOINTS } from "../constants/ophim";

class OPhimService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${OPHIM_CONFIG.BASE_URL}/${OPHIM_CONFIG.API_VERSION}/api`,
      timeout: OPHIM_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // ==================== HOME ====================

  /**
   * Lấy dữ liệu trang chủ
   * GET /v1/api/home
   */
  async getHome(): Promise<HomeResponse> {
    const response = await this.api.get<HomeResponse>(OPHIM_ENDPOINTS.HOME);
    return response.data;
  }

  // ==================== MOVIE LIST ====================

  /**
   * Lấy danh sách phim theo slug
   * GET /v1/api/danh-sach/{slug}
   *
   * @param slug - phim-moi | phim-bo | phim-le | tv-shows | hoat-hinh |
   *               phim-chieu-rap | phim-bo-dang-chieu | phim-bo-hoan-thanh | phim-sap-chieu
   * @param params - Query parameters (page, limit, sort, filter)
   */
  async getMovieList(
    slug: string,
    params?: MovieListQueryParams,
  ): Promise<MovieListResponse> {
    const response = await this.api.get<MovieListResponse>(
      OPHIM_ENDPOINTS.MOVIE_LIST(slug),
      { params },
    );
    return response.data;
  }

  // ==================== SEARCH ====================

  /**
   * Tìm kiếm phim
   * GET /v1/api/tim-kiem
   *
   * @param params - keyword (required, >= 2 chars), page, limit
   */
  async searchMovies(params: SearchQueryParams): Promise<SearchResponse> {
    const response = await this.api.get<SearchResponse>(
      OPHIM_ENDPOINTS.SEARCH,
      { params },
    );
    return response.data;
  }

  // ==================== CATEGORY (THỂ LOẠI) ====================

  /**
   * Lấy danh sách thể loại
   * GET /v1/api/the-loai
   */
  async getCategories(): Promise<FilterListResponse> {
    const response = await this.api.get<FilterListResponse>(
      OPHIM_ENDPOINTS.CATEGORIES,
    );
    return response.data;
  }

  /**
   * Lấy phim theo thể loại
   * GET /v1/api/the-loai/{slug}
   */
  async getMoviesByCategory(
    slug: string,
    params?: MovieListQueryParams,
  ): Promise<MovieListResponse> {
    const response = await this.api.get<MovieListResponse>(
      OPHIM_ENDPOINTS.CATEGORY_MOVIES(slug),
      { params },
    );
    return response.data;
  }

  // ==================== COUNTRY (QUỐC GIA) ====================

  /**
   * Lấy danh sách quốc gia
   * GET /v1/api/quoc-gia
   */
  async getCountries(): Promise<FilterListResponse> {
    const response = await this.api.get<FilterListResponse>(
      OPHIM_ENDPOINTS.COUNTRIES,
    );
    return response.data;
  }

  /**
   * Lấy phim theo quốc gia
   * GET /v1/api/quoc-gia/{slug}
   */
  async getMoviesByCountry(
    slug: string,
    params?: MovieListQueryParams,
  ): Promise<MovieListResponse> {
    const response = await this.api.get<MovieListResponse>(
      OPHIM_ENDPOINTS.COUNTRY_MOVIES(slug),
      { params },
    );
    return response.data;
  }

  // ==================== YEAR (NĂM PHÁT HÀNH) ====================

  /**
   * Lấy danh sách năm phát hành
   * GET /v1/api/nam-phat-hanh
   */
  async getYears(): Promise<FilterListResponse> {
    const response = await this.api.get<FilterListResponse>(
      OPHIM_ENDPOINTS.YEARS,
    );
    return response.data;
  }

  /**
   * Lấy phim theo năm
   * GET /v1/api/nam-phat-hanh/{year}
   */
  async getMoviesByYear(
    year: number,
    params?: Omit<MovieListQueryParams, "year">,
  ): Promise<MovieListResponse> {
    const response = await this.api.get<MovieListResponse>(
      OPHIM_ENDPOINTS.YEAR_MOVIES(year),
      { params },
    );
    return response.data;
  }

  // ==================== MOVIE DETAIL ====================

  /**
   * Lấy chi tiết phim
   * GET /v1/api/phim/{slug}
   */
  async getMovieDetail(slug: string): Promise<MovieDetailResponse> {
    const response = await this.api.get<MovieDetailResponse>(
      OPHIM_ENDPOINTS.MOVIE_DETAIL(slug),
    );
    return response.data;
  }

  /**
   * Lấy hình ảnh phim (posters, backdrops)
   * GET /v1/api/phim/{slug}/images
   */
  async getMovieImages(slug: string): Promise<MovieImagesResponse> {
    const response = await this.api.get<MovieImagesResponse>(
      OPHIM_ENDPOINTS.MOVIE_IMAGES(slug),
    );
    return response.data;
  }

  /**
   * Lấy thông tin diễn viên & đạo diễn
   * GET /v1/api/phim/{slug}/peoples
   */
  async getMoviePeoples(slug: string): Promise<MoviePeoplesResponse> {
    const response = await this.api.get<MoviePeoplesResponse>(
      OPHIM_ENDPOINTS.MOVIE_PEOPLES(slug),
    );
    return response.data;
  }

  /**
   * Lấy từ khoá phim
   * GET /v1/api/phim/{slug}/keywords
   */
  async getMovieKeywords(slug: string): Promise<MovieKeywordsResponse> {
    const response = await this.api.get<MovieKeywordsResponse>(
      OPHIM_ENDPOINTS.MOVIE_KEYWORDS(slug),
    );
    return response.data;
  }
}

export const ophimService = new OPhimService();
export default ophimService;
