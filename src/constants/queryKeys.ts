/**
 * React Query Cache Configuration
 * Query keys và stale time cho OPhim API
 */

// ==================== CACHE TIMES ====================

/**
 * Thời gian cache (staleTime) cho các loại API khác nhau
 * Đơn vị: milliseconds
 */
export const CACHE_TIME = {
  // Data ít thay đổi - cache lâu
  FILTERS: 1000 * 60 * 60 * 24, // 24 giờ (categories, countries, years)

  // Data thay đổi thường xuyên - cache ngắn
  HOME: 1000 * 60 * 5, // 5 phút
  MOVIE_LIST: 1000 * 60 * 10, // 10 phút
  SEARCH: 1000 * 60 * 3, // 3 phút (search thường realtime)

  // Chi tiết phim - cache trung bình
  MOVIE_DETAIL: 1000 * 60 * 30, // 30 phút
  MOVIE_IMAGES: 1000 * 60 * 60, // 1 giờ
  MOVIE_PEOPLES: 1000 * 60 * 60, // 1 giờ
  MOVIE_KEYWORDS: 1000 * 60 * 60, // 1 giờ
} as const;

// ==================== QUERY KEYS ====================

/**
 * Query keys factory cho React Query
 * Sử dụng array keys để dễ invalidate và refetch
 */
export const OPHIM_QUERY_KEYS = {
  // Base key
  all: ["ophim"] as const,

  // Home
  home: () => [...OPHIM_QUERY_KEYS.all, "home"] as const,

  // Movie Lists
  movieLists: () => [...OPHIM_QUERY_KEYS.all, "movieList"] as const,
  movieList: (slug: string, params?: Record<string, any>) =>
    [...OPHIM_QUERY_KEYS.movieLists(), slug, params] as const,

  // Search
  searches: () => [...OPHIM_QUERY_KEYS.all, "search"] as const,
  search: (params: Record<string, any>) =>
    [...OPHIM_QUERY_KEYS.searches(), params] as const,

  // Categories
  categories: () => [...OPHIM_QUERY_KEYS.all, "categories"] as const,
  categoryMovies: (slug: string, params?: Record<string, any>) =>
    [...OPHIM_QUERY_KEYS.all, "category", slug, params] as const,

  // Countries
  countries: () => [...OPHIM_QUERY_KEYS.all, "countries"] as const,
  countryMovies: (slug: string, params?: Record<string, any>) =>
    [...OPHIM_QUERY_KEYS.all, "country", slug, params] as const,

  // Years
  years: () => [...OPHIM_QUERY_KEYS.all, "years"] as const,
  yearMovies: (year: number, params?: Record<string, any>) =>
    [...OPHIM_QUERY_KEYS.all, "year", year, params] as const,

  // Movie Detail
  movieDetails: () => [...OPHIM_QUERY_KEYS.all, "movieDetail"] as const,
  movieDetail: (slug: string) =>
    [...OPHIM_QUERY_KEYS.movieDetails(), slug] as const,

  // Movie Images
  movieImages: (slug: string) =>
    [...OPHIM_QUERY_KEYS.all, "movieImages", slug] as const,

  // Movie Peoples
  moviePeoples: (slug: string) =>
    [...OPHIM_QUERY_KEYS.all, "moviePeoples", slug] as const,

  // Movie Keywords
  movieKeywords: (slug: string) =>
    [...OPHIM_QUERY_KEYS.all, "movieKeywords", slug] as const,
} as const;
