# Movie App - React Native

Ứng dụng xem phim được xây dựng với React Native, TypeScript và Expo.

## 🛠 Công nghệ sử dụng

- **React Native** + **Expo** - Framework mobile đa nền tảng
- **TypeScript** - Type-safe JavaScript
- **React Query** (@tanstack/react-query) - Quản lý state và API calls
- **React Navigation** - Điều hướng trong app
- **i18next** - Đa ngôn ngữ (Tiếng Việt & English)
- **Context API** - Quản lý theme (Light/Dark mode)

## 📁 Cấu trúc thư mục

```
/src
  /components     # UI components tái sử dụng
  /screens        # Màn hình chính
  /navigation     # Cấu hình navigation
  /services       # API services
  /hooks          # Custom React hooks
  /contexts       # React contexts
  /types          # TypeScript types & interfaces
  /constants      # Hằng số và config
  /locales        # File dịch thuật (vi, en)
  /theme          # Cấu hình theme
```

## 🚀 Cài đặt

1. **Cài đặt dependencies:**

```bash
npm install
```

2. **Cấu hình TMDB API:**
   - Đăng ký tài khoản tại [https://www.themoviedb.org](https://www.themoviedb.org)
   - Lấy API key tại [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Thay thế `YOUR_TMDB_API_KEY_HERE` trong `src/constants/api.ts`

3. **Chạy ứng dụng:**

```bash
# Chạy trên iOS
npm run ios

# Chạy trên Android
npm run android

# Chạy trên web
npm run web

# Chạy với Expo
npm start
```

## ✨ Tính năng

- ✅ Xem danh sách phim phổ biến
- ✅ Xem chi tiết phim
- ✅ Đa ngôn ngữ (Tiếng Việt/English)
- ✅ Chế độ sáng/tối
- ✅ UI responsive
- ✅ Type-safe với TypeScript

## 📝 Quy tắc phát triển

1. **KHÔNG tạo file test** - Dự án không sử dụng testing files
2. **Chỉ sử dụng TypeScript** - Không sử dụng JavaScript
3. **Tất cả text phải dùng i18n** - Không hard-code text
4. **UI phải support theme** - Sử dụng theme colors từ context
5. **Strict typing** - Phải define types cho tất cả

## 🎨 Theme

App hỗ trợ 2 chế độ:

- **Light Mode** - Giao diện sáng
- **Dark Mode** - Giao diện tối (mặc định)

Chuyển đổi theme bằng nút trong HomeScreen.

## 🌐 Đa ngôn ngữ

Ngôn ngữ mặc định: **Tiếng Việt**

Hỗ trợ:

- 🇻🇳 Tiếng Việt (vi)
- 🇬🇧 English (en)

## 📄 License

MIT
