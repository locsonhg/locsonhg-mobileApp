/**
 * OPhim API URLs & Endpoints
 * Base URL: https://ophim1.com/v1/api
 */

export const OPHIM_CONFIG = {
  BASE_URL: "https://ophim1.com",
  API_VERSION: "v1",
  CDN_IMAGE_URL: "https://img.ophim.live/uploads/movies",
  TIMEOUT: 10000,
} as const;

export const OPHIM_ENDPOINTS = {
  // Home
  HOME: "/home",

  // Movie Lists
  MOVIE_LIST: (slug: string) => `/danh-sach/${slug}`,

  // Search
  SEARCH: "/tim-kiem",

  // Category (Thể loại)
  CATEGORIES: "/the-loai",
  CATEGORY_MOVIES: (slug: string) => `/the-loai/${slug}`,

  // Country (Quốc gia)
  COUNTRIES: "/quoc-gia",
  COUNTRY_MOVIES: (slug: string) => `/quoc-gia/${slug}`,

  // Year (Năm phát hành)
  YEARS: "/nam-phat-hanh",
  YEAR_MOVIES: (year: number) => `/nam-phat-hanh/${year}`,

  // Movie Detail
  MOVIE_DETAIL: (slug: string) => `/phim/${slug}`,
  MOVIE_IMAGES: (slug: string) => `/phim/${slug}/images`,
  MOVIE_PEOPLES: (slug: string) => `/phim/${slug}/peoples`,
  MOVIE_KEYWORDS: (slug: string) => `/phim/${slug}/keywords`,
} as const;

/**
 * Movie list slugs
 */
export const MOVIE_LIST_SLUGS = {
  NEW: "phim-moi",
  SERIES: "phim-bo",
  SINGLE: "phim-le",
  TV_SHOWS: "tv-shows",
  ANIMATION: "hoat-hinh",
  THEATER: "phim-chieu-rap",
  ONGOING_SERIES: "phim-bo-dang-chieu",
  COMPLETED_SERIES: "phim-bo-hoan-thanh",
  UPCOMING: "phim-sap-chieu",
} as const;

/**
 * Sort options
 */
export const SORT_OPTIONS = {
  MODIFIED_TIME: "modified.time",
  YEAR: "year",
  ID: "_id",
} as const;

export const SORT_TYPES = {
  ASC: "asc",
  DESC: "desc",
} as const;
