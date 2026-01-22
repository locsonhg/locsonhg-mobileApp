// TMDB API Types
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: Genre[];
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  Detail: { slug: string };
  Search: undefined;
  VideoPlayer: {
    videoUrl: string;
    movieTitle: string;
    episodes?: Array<{ name: string; slug: string; link_embed: string }>;
    currentEpisodeIndex?: number;
  };
};
