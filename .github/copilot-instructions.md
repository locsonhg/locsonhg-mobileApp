<!-- Project workspace instructions for React Native Movie App -->

## 📋 Project Overview

**Movie App** - Ứng dụng xem phim React Native với TypeScript

### Core Technologies

- **Framework**: React Native + Expo
- **Language**: TypeScript (KHÔNG dùng JavaScript)
- **API Management**: React Query (@tanstack/react-query)
- **Internationalization**: i18next + react-i18next
- **Default Language**: Tiếng Việt (vi)
- **Supported Languages**: Tiếng Việt, English
- **Theme**: Light/Dark mode with Context API

## 🚫 Project Rules

1. **NO TEST FILES** - Không tạo file test (.test.ts, .spec.ts, **tests**)
2. **TypeScript Only** - Tất cả file code phải là .ts hoặc .tsx
3. **No Mock Data** - Chỉ dùng API thật từ OPhim, KHÔNG tạo data mẫu test
4. **Strict Typing** - Phải define types/interfaces cho tất cả
5. **Strict Interface Compliance** - PHẢI tuân thủ chính xác interfaces đã định nghĩa trong /src/types/ophim.ts
   - Không được tự ý thay đổi tên property (vd: `movie` → `item`)
   - Không được skip type checking với `any` trừ khi thật sự cần thiết
   - Luôn check interface trước khi implement
6. **i18n Required** - Tất cả text phải dùng i18n translation
7. **Theme Context** - UI phải support cả light và dark mode
8. **NO TypeScript Errors** - Code phải compile không có lỗi TypeScript
9. **Sort Movies by Latest** - Khi query danh sách phim, LUÔN sort theo `modified.time` desc để hiển thị phim mới nhất trước
10. **Component-Based Architecture** - Tổ chức code theo module & component:

- Tạo reusable components để tái sử dụng
- Tránh duplicate code, luôn kiểm tra xem đã có component tương tự chưa
- Component phải nhỏ, tập trung vào 1 chức năng
- Đảm bảo tính đồng nhất giữa các màn hình (consistent UI/UX)
- Sử dụng composition thay vì duplication
- **KHÔNG để 1 file quá lớn (>300 dòng)** - phải tách thành các component nhỏ hơn

11. **Performance Optimization - Lazy Loading**:

- **Trang chủ**: Load nhiều thể loại phim theo scroll (lazy load sections)
- **Images**: Lazy load ảnh khi scroll đến (không load hết ngay từ đầu)
- **Lists**: Sử dụng FlatList với pagination/infinite scroll
- **Avoid Heavy Load**: Không load 1 lượng dữ liệu lớn trong 1 thời điểm
- **Progressive Loading**: Load từng section khi user scroll đến

11. **Image Optimization - Use expo-image**:

- **KHÔNG dùng** React Native `Image` component mặc định
- **BẮT BUỘC dùng** `expo-image` với `cachePolicy="memory-disk"`
- Hỗ trợ cache tự động (memory + disk)
- Progressive loading cho trải nghiệm tốt hơn
- Placeholder & transition effects

## 📁 Project Structure

```
/src
  /components     # Reusable UI components
    /common       # Common components (Button, Input, Card...)
    /movie        # Movie-specific components (MovieCard, MovieList...)
    /layout       # Layout components (Header, Footer, Container...)
  /screens        # App screens (Home, Detail, Search...)
  /navigation     # Navigation setup
  /services       # API services (ophimService.ts)
  /hooks          # Custom React hooks (useOphimQueries, useTheme)
  /contexts       # React contexts (ThemeContext)
  /types          # TypeScript types & interfaces
  /constants      # Constants & config (API URLs, cache keys)
  /locales        # i18n translation files (vi, en)
  /theme          # Theme configuration (colors, spacing, typography)
  /utils          # Utility functions (helpers, formatters)
```

with OPhim API

- ✅ Setup i18n with Vietnamese default
- ✅ Setup Theme Context (Light/Dark)
- ✅ Create core project structure
- ✅ Create OPhim API types & interfaces
- ✅ Create API service with axios
- ✅ Create React Query hooks with cache strategy
- ✅ Define component architecture guidelines

## 🎯 Development Workflow

### Before Creating New Component

1. **Check existing components** - Có component tương tự chưa?
2. **Identify reusability** - Component này dùng ở bao nhiêu chỗ?
3. **Define clear props** - Props cần thiết là gì?
4. **Consider variants** - Cần variants/modes khác nhau không?

### Before Creating New Screen

1. **List required components** - Screen cần components gì?
2. **Check for reusable logic** - Logic nào có thể extract thành hook?
3. **Plan data fetching** - Dùng hooks nào từ `useOphimQueries`?
4. **Design responsive layout** - Mobile-first approach

### Code Quality Checklist

- [ ] TypeScript interfaces defined
- [ ] No TypeScript errors
- [ ] i18n for all text
- [ ] Theme colors used (no hardcoded colors)
- [ ] Component reusable & testable
- [ ] Props documented with JSDoc
- [ ] Responsive design implemented
- **Common components** (`/components/common`): Button, Input, Card, Loading, Error...
- **Feature components** (`/components/movie`): MovieCard, MovieList, MovieGrid...
- **Layout components** (`/components/layout`): Header, Navigation, Container...

### Component Principles

1. **Single Responsibility**: Mỗi component chỉ làm 1 việc
2. **Reusability**: Design component để tái sử dụng nhiều nơi
3. **Props Interface**: Luôn define TypeScript interface cho props
4. **Theme Integration**: Sử dụng `useTheme()` cho colors/styles
5. **i18n Integration**: Sử dụng `useTranslation()` cho text

### Component Naming

- PascalCase cho component: `MovieCard.tsx`, `SearchBar.tsx`
- Descriptive names: `UserAvatar.tsx` thay vì `Avatar.tsx`
- Suffix rõ ràng: `MovieList.tsx`, `MovieGrid.tsx`, `MovieCarousel.tsx`

### Example Component Structure

```typescript
// /src/components/movie/MovieCard.tsx
interface MovieCardProps {
  movie: MovieItem;
  onPress: () => void;
  variant?: "default" | "compact" | "featured";
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPress,
  variant = "default",
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  // Component logic
};
```

## ⚡ Performance & Optimization

### 1️⃣ API & Data Fetching Rules

**Rule: Lazy Fetch - Chỉ fetch khi cần**

- ❌ Không fetch tất cả API khi app mở
- ✅ Chỉ fetch khi user navigate đến screen
- Home → fetch `/home` khi vào trang chủ
- List → fetch khi vào list screen
- Detail → fetch khi click vào phim cụ thể
- **Do not fetch movie detail data until user navigates to detail screen**

**Rule: Cache Response (bắt buộc)**

- Enable stale-while-revalidate caching for list APIs
- Cache Home/List trong memory với React Query
- Cache Detail theo slug
- Sử dụng `staleTime` phù hợp (đã config trong queryKeys)

**Rule: Không refetch khi back screen**

- Disable `refetchOnWindowFocus` và `refetchOnMount`
- Dùng cache data khi quay lại screen

```typescript
// ✅ Good
useQuery({
  queryKey: ["movie", slug],
  queryFn: () => fetchMovie(slug),
  staleTime: 1000 * 60 * 30, // 30 phút
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});
```

### 2️⃣ UI & Rendering Rules

**Rule: FlatList (rất quan trọng)**

- ❌ KHÔNG BAO GIỜ dùng ScrollView cho list phim
- ✅ LUÔN dùng FlatList với config tối ưu:

```typescript
<FlatList
  data={movies}
  keyExtractor={(item) => item.slug}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  renderItem={({ item }) => <MovieCard movie={item} />}
/>
```

**Rule: Memo hoá components**

- Wrap movie item components with `React.memo`
- Props phải stable (sử dụng useCallback cho functions)

```typescript
// ✅ Good
const MovieCard = React.memo(({ movie, onPress }) => {
  // Component logic
});
```

**Rule: Thumbnail vs Full Image**

- List → dùng `thumb_url` (nhẹ hơn)
- Detail → mới dùng `poster_url` (full size)
- **Use thumbnail images for lists, full images only on detail screen**

### 3️⃣ Image Optimization Rules

**Rule: expo-image (bắt buộc)**

- ❌ Không dùng React Native `Image` mặc định
- ✅ Dùng `expo-image` với `cachePolicy="memory-disk"`

```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: movie.thumb_url }}
  cachePolicy="memory-disk"
  placeholder={placeholderImage}
  transition={200}
/>
```

**Rule: Lazy Load Images**

- Ảnh chỉ load khi sắp hiển thị trên màn hình
- Kết hợp FlatList + expo-image
- Không load ảnh ngoài viewport

### 4️⃣ Navigation Rules

**Rule: Clear state on unmount**

- Clear screen-specific state khi unmount
- Tránh memory leak

**Rule: Primitive navigation params**

- ❌ Không truyền object phim qua navigation
- ✅ Chỉ truyền slug (primitive value)

```typescript
// ✅ Good
navigation.navigate("Detail", { slug: movie.slug });

// ❌ Bad
navigation.navigate("Detail", { movie: movieObject });
```

### 5️⃣ Video Player Rules

**Rule: Mount player khi cần**

- ❌ Không auto render video player
- ✅ Chỉ mount player khi user bấm Play
- **Do not mount video player until user presses Play**

**Rule: Unmount video khi back**

- Always unmount video component on screen blur
- Tránh leak RAM

```typescript
useEffect(() => {
  const unsubscribe = navigation.addListener("blur", () => {
    // Unmount video player
  });
  return unsubscribe;
}, [navigation]);
```

### 6️⃣ Search Optimization Rules

**Rule: Debounce search**

- Debounce 300-500ms
- Không gọi API mỗi ký tự
- Chỉ search khi keyword >= 2 ký tự

```typescript
// ✅ Good - Debounced search
const debouncedSearch = useMemo(
  () =>
    debounce((keyword) => {
      if (keyword.length >= 2) {
        searchMovies(keyword);
      }
    }, 300),
  [],
);
```

### Best Practices Summary

**FlatList Optimization:**

```typescript
// ✅ Good - Optimized FlatList
<FlatList
  data={movies}
  keyExtractor={(item) => item.slug}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  onEndReached={loadMore}
  renderItem={({ item }) => <MemoizedMovieCard movie={item} />}
/>

// ❌ Bad - Load everything at once
{movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
```

## 🧱 Wireframe & Screen Structure

### App Architecture

```
App
└── BottomTabNavigator
    ├── HomeScreen
    ├── CategoriesScreen
    ├── SearchScreen
    ├── FavoritesScreen
    └── ProfileScreen
```

**Theme:** Dark mode mặc định (có toggle sang Light)

### 🏠 HomeScreen

**Mục tiêu:** Khám phá phim nhanh, nội dung nổi bật

**Layout:**

```
SafeAreaView
└── ScrollView
    ├── Header
    │   ├── AppLogo (left)
    │   └── SearchIcon (right)
    │
    ├── HeroCarousel
    │   └── MovieBannerItem (poster + title overlay)
    │
    ├── MovieSection (Phim Hot)
    │   ├── SectionHeader (title + "Xem tất cả")
    │   └── HorizontalFlatList
    │       └── MovieCard
    │
    ├── MovieSection (Phim Mới)
    ├── MovieSection (Phim Bộ)
    └── MovieSection (Phim Lẻ)
```

**Component Rules:**

- Poster bo góc (borderRadius: 8)
- Skeleton loader khi loading
- Lazy load ảnh với expo-image
- FlatList horizontal với windowSize={5}

### 🎬 MovieDetailScreen

**Mục tiêu:** Xem thông tin, chọn tập, phát video

**Layout:**

```
ScrollView
├── PosterHeader
│   ├── BackdropImage (expo-image)
│   └── GradientOverlay
│
├── MovieInfo
│   ├── Title
│   ├── Meta (year • country • quality)
│   ├── Rating (⭐ TMDB / IMDb)
│
├── ActionButtons
│   ├── PlayButton (primary)
│   └── TrailerButton (secondary)
│
└── Tabs (swipeable)
    ├── InfoTab
    │   ├── DescriptionText
    │   └── MetadataList
    │
    ├── EpisodesTab
    │   └── ServerList
    │       └── FlatList (EpisodeButton)
    │
    └── CastTab
        └── HorizontalFlatList
            └── ActorCard
```

**UX Rules:**

- Tabs sticky khi scroll
- Episode button rõ ràng (highlight watched)
- Chuyển player nhanh (navigation với slug)

### ▶️ PlayerScreen

**Mục tiêu:** Trải nghiệm xem phim mượt, fullscreen

**Layout:**

```
VideoPlayer (fullscreen)
└── OverlayControls (auto-hide)
    ├── TopBar
    │   ├── BackButton
    │   └── Title
    │
    ├── CenterControls
    │   ├── RewindButton (-10s)
    │   ├── Play/Pause
    │   └── ForwardButton (+10s)
    │
    └── BottomBar
        ├── SeekBar
        ├── TimeText (current / duration)
        ├── ServerSelector
        └── EpisodeSelector
```

**Performance Rules:**

- Mount player chỉ khi screen active
- Unmount video khi back
- Preload episode tiếp theo
- Auto-hide controls sau 3s

### 🔍 SearchScreen

**Mục tiêu:** Tìm nhanh, không lag

**Layout:**

```
SafeAreaView
├── SearchInput (debounced 300ms)
│
├── RecentSection (khi chưa search)
│   └── RecentKeywordsList
│
└── ResultsSection
    └── FlatList (2 columns)
        └── MovieCard
            └── RemovableOverlay
```

**UX Rules:**

- Debounce 300-500ms
- Search khi keyword >= 2 ký tự
- Infinite scroll với pagination
- Clear search icon

### 🧩 CategoriesScreen

**Mục tiêu:** Filter và khám phá theo tiêu chí

**Layout:**

```
ScrollView
├── FilterSection
│   ├── CategoryChips (horizontal scroll)
│   ├── CountryChips
│   ├── YearChips
│   └── SortOptions (dropdown)
│
└── MovieGrid
    └── FlatList (2 columns)
        └── MovieCard
```

**UX Rules:**

- Selected chip highlight
- Apply filter ngay khi chọn
- Infinite scroll

### ❤️ FavoritesScreen

**Mục tiêu:** Quản lý phim yêu thích

**Layout:**

```
SafeAreaView
├── Header
│   └── Title
│
└── MovieGrid
    └── FlatList (2 columns)
        └── MovieCard
            └── FavoriteIcon (removable)
```

**Storage Rules:**

- Lưu bằng AsyncStorage
- Không cần login
- Sync khi open app

### 👤 ProfileScreen

**Mục tiêu:** Cài đặt và thông tin

**Layout:**

```
SafeAreaView
├── UserInfo
│   ├── Avatar (placeholder)
│   └── Username
│
├── SettingsList
│   ├── ThemeToggle (Light/Dark)
│   ├── LanguageSelector (Vi/En)
│   ├── ClearCache
│   └── AppInfo
│       ├── Version
│       └── AboutButton
```

## 🎨 UI Design System

### Colors (Dark Theme Default)

```typescript
{
  primary: '#e50914',
  background: '#1f1f1f',
  card: '#2a2a2a',
  text: '#ffffff',
  textSecondary: '#999999',
  border: '#333333',
}
```

### Typography

- Title: Bold, 24px
- Subtitle: SemiBold, 18px
- Body: Regular, 14px
- Caption: Regular, 12px

### Spacing

- xs: 4, sm: 8, md: 16, lg: 24, xl: 32

### Border Radius

- Small: 4, Medium: 8, Large: 12

## ✅ Completed Tasks

- ✅ Setup TypeScript configuration
- ✅ Setup React Query
- ✅ Setup i18n with Vietnamese default
- ✅ Setup Theme Context (Light/Dark)
- ✅ Create core project structure
