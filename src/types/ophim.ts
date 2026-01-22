/**
 * OPhim API Types & Interfaces
 * Base URL: https://ophim1.com
 * API Version: v1
 * Auth: None required
 */

// ==================== COMMON TYPES ====================

/** Base API Response wrapper */
export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

/** Pagination thông tin */
export interface Pagination {
  currentPage: number;
  totalItems: number;
  totalItemsPerPage: number;
  totalPages?: number;
}

/** Params chứa pagination */
export interface PaginationParams {
  pagination: Pagination;
}

/** Category/Genre/Country/Year - Cấu trúc chung cho filter */
export interface FilterItem {
  _id: string;
  slug: string;
  name: string;
}

/** SEO metadata */
export interface SeoOnPage {
  titleHead: string;
  descriptionHead: string;
}

// ==================== MOVIE TYPES ====================

/** Movie type */
export type MovieType = "series" | "single";

/** Movie status */
export type MovieStatus = "ongoing" | "completed" | "trailer" | "upcoming";

/** Movie item trong danh sách (List/Home/Search) */
export interface MovieItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  alternative_names?: string[];
  type: MovieType;
  thumb_url: string;
  poster_url: string;
  year: number;
  category: FilterItem[];
  country: FilterItem[];
  time?: string;
  episode_current?: string;
  episode_total?: string;
  quality?: string;
  lang?: string;
  chieurap?: boolean;
  sub_docquyen?: boolean;
}

/** TMDB rating data */
export interface TmdbRating {
  type: string;
  id: string;
  season?: number;
  vote_average: number;
  vote_count: number;
}

/** IMDB rating data */
export interface ImdbRating {
  id: string;
  vote_average: number;
  vote_count: number;
}

/** Episode server data */
export interface EpisodeServerData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

/** Episode server */
export interface EpisodeServer {
  server_name: string;
  server_data: EpisodeServerData[];
}

/** Movie detail - Full info */
export interface MovieDetail {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: MovieType;
  status: MovieStatus;
  poster_url: string;
  thumb_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url?: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify?: string;
  showtimes?: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: FilterItem[];
  country: FilterItem[];
  episodes: EpisodeServer[];
  tmdb?: TmdbRating;
  imdb?: ImdbRating;
  created?: {
    time: string;
  };
  modified?: {
    time: string;
  };
}

// ==================== REQUEST PARAMS ====================

/** Query params cho API danh sách phim */
export interface MovieListQueryParams {
  page?: number;
  limit?: number;
  sort_field?: "modified.time" | "year" | "_id";
  sort_type?: "asc" | "desc";
  category?: string; // comma separated slugs
  country?: string;
  year?: number;
}

/** Query params cho search */
export interface SearchQueryParams {
  keyword: string;
  page?: number;
  limit?: number;
}

// ==================== RESPONSE DATA ====================

/** Response data cho Home API */
export interface HomeData {
  seoOnPage: SeoOnPage;
  items: MovieItem[];
  params: PaginationParams;
  APP_DOMAIN_CDN_IMAGE: string;
  APP_DOMAIN_FRONTEND: string;
}

/** Response data cho List/Filter APIs */
export interface MovieListData {
  titlePage: string;
  items: MovieItem[];
  params: PaginationParams;
  breadCrumb?: Array<{
    name: string;
    slug?: string;
    position: number;
  }>;
}

/** Response data cho Search API */
export interface SearchData {
  titlePage: string;
  items: MovieItem[];
  params: PaginationParams & {
    keyword: string;
  };
}

/** Response data cho Filter List (Category/Country/Year) */
export interface FilterListData {
  items: FilterItem[];
}

/** Response data cho Movie Detail API */
export interface MovieDetailData {
  item: MovieDetail;
  seoOnPage?: SeoOnPage;
  breadCrumb?: Array<{
    name: string;
    slug?: string;
    position: number;
  }>;
}

/** Movie Images data */
export interface MovieImagesData {
  image_sizes: {
    backdrop_sizes: string[];
    poster_sizes: string[];
  };
  images: {
    backdrops: Array<{
      file_path: string;
      width: number;
      height: number;
    }>;
    posters: Array<{
      file_path: string;
      width: number;
      height: number;
    }>;
  };
}

/** Movie People data */
export interface MoviePeople {
  id: number;
  name: string;
  character?: string;
  job?: string;
  profile_path?: string;
}

export interface MoviePeoplesData {
  peoples: MoviePeople[];
}

/** Movie Keywords data */
export interface MovieKeyword {
  id: number;
  name: string;
}

export interface MovieKeywordsData {
  keywords: MovieKeyword[];
}

// ==================== FINAL API RESPONSES ====================

/** Home API Response */
export type HomeResponse = ApiResponse<HomeData>;

/** Movie List API Response */
export type MovieListResponse = ApiResponse<MovieListData>;

/** Search API Response */
export type SearchResponse = ApiResponse<SearchData>;

/** Filter List Response (Category/Country/Year) */
export type FilterListResponse = ApiResponse<FilterListData>;

/** Movie Detail Response */
export type MovieDetailResponse = ApiResponse<MovieDetailData>;

/** Movie Images Response */
export type MovieImagesResponse = ApiResponse<MovieImagesData>;

/** Movie Peoples Response */
export type MoviePeoplesResponse = ApiResponse<MoviePeoplesData>;

/** Movie Keywords Response */
export type MovieKeywordsResponse = ApiResponse<MovieKeywordsData>;
