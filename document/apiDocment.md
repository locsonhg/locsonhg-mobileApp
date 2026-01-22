# 📘 OPhim API Documentation (Clean Version for Copilot)

Tài liệu này được chuẩn hoá để **Copilot / AI dễ hiểu và triển khai service + interface** cho dự án (React Native / Web). Nội dung tập trung vào **endpoint, input, output, ý nghĩa sử dụng**, không rườm rà.

---

## 1. Tổng quan API

- **Loại API:** RESTful
- **Base URL:**

```
https://ophim1.com
```

- **HTTP Method:** GET
- **Response format:** JSON
- **Encoding:** UTF-8
- **Authentication:** Không cần

API cung cấp dữ liệu phim đầy đủ để xây dựng app xem phim.

---

## 2. Phạm vi dữ liệu

### 🎬 Dữ liệu phim

- Thông tin phim (tên, mô tả, năm, trạng thái)
- Phim lẻ, phim bộ
- Episode & server stream

### 🖼 Hình ảnh

- Poster, thumbnail
- Backdrop HD từ TMDB

### 🎭 Thông tin phim

- Diễn viên
- Đạo diễn
- Từ khoá phim

### 🔍 Tìm kiếm & lọc

- Tìm kiếm theo từ khoá
- Lọc theo: thể loại, quốc gia, năm
- Sắp xếp
- Phân trang

---

## 3. API Trang Chủ

### Endpoint

```
GET /v1/api/home
```

### Mục đích

- Lấy danh sách phim hiển thị trên trang chủ
- Dùng cho **Home Screen**

### Input

- Không có

### Output (chi tiết)

```json
{
  "status": "success",
  "message": "Lấy dữ liệu thành công",
  "data": {
    "seoOnPage": {
      "titleHead": "string",
      "descriptionHead": "string"
    },
    "items": [
      {
        "_id": "string",
        "name": "string",
        "slug": "string",
        "origin_name": "string",
        "alternative_names": ["string"],
        "type": "series | single",
        "thumb_url": "string",
        "poster_url": "string",
        "year": number,
        "category": [
          { "id": "string", "name": "string", "slug": "string" }
        ],
        "country": [
          { "id": "string", "name": "string", "slug": "string" }
        ]
      }
    ],
    "params": {
      "pagination": {
        "currentPage": number,
        "totalItems": number,
        "totalItemsPerPage": number
      }
    },
    "APP_DOMAIN_CDN_IMAGE": "string",
    "APP_DOMAIN_FRONTEND": "string"
  }
}
```

### Ghi chú sử dụng

- `slug` dùng để gọi API chi tiết phim
- `thumb_url`, `poster_url` dùng cho UI list

---

## 4. API Danh Sách Phim (List / Filter)

### Endpoint

```
GET /v1/api/danh-sach/{slug}
```

### Slug hợp lệ

- phim-moi
- phim-bo
- phim-le
- tv-shows
- hoat-hinh
- phim-chieu-rap
- phim-bo-dang-chieu
- phim-bo-hoan-thanh
- phim-sap-chieu

### Query Parameters (optional)

- page (default: 1)
- limit (default: 24)
- sort_field: modified.time | year | \_id
- sort_type: asc | desc
- category: slug thể loại (comma separated)
- country: slug quốc gia
- year: năm phát hành

### Output (rút gọn)

```json
{
  "status": "success",
  "data": {
    "titlePage": "string",
    "items": [ ... ],
    "params": {
      "pagination": {
        "currentPage": number,
        "totalItems": number,
        "totalItemsPerPage": number,
        "totalPages": number
      }
    }
  }
}
```

### Dùng cho

- Danh sách phim
- Infinite scroll
- Filter screen

---

## 5. API Tìm Kiếm

### Endpoint

```
GET /v1/api/tim-kiem
```

### Query Parameters

- keyword (bắt buộc, >= 2 ký tự)
- page
- limit

### Output

```json
{
  "status": "success",
  "data": {
    "titlePage": "string",
    "items": [ ... ],
    "params": {
      "keyword": "string",
      "pagination": {
        "currentPage": number,
        "totalItems": number,
        "totalItemsPerPage": number,
        "totalPages": number
      }
    }
  }
}
```

### Dùng cho

- Search screen
- Debounce search

---

## 6. API Thể Loại

### Lấy danh sách thể loại

```
GET /v1/api/the-loai
```

### Output

```json
{
  "status": "success",
  "data": [{ "_id": "string", "slug": "string", "name": "string" }]
}
```

### Lấy phim theo thể loại

```
GET /v1/api/the-loai/{slug}
```

### Query Parameters

- page
- limit
- sort_field
- sort_type
- country
- year

### Output (rút gọn)

```json
{
  "status": "success",
  "data": {
    "titlePage": "string",
    "items": [ ... ],
    "params": { "pagination": { ... } }
  }
}
```

---

## 7. API Quốc Gia

### Lấy danh sách quốc gia

```
GET /v1/api/quoc-gia
```

### Output

```json
{
  "status": "success",
  "data": [{ "_id": "string", "slug": "string", "name": "string" }]
}
```

### Lấy phim theo quốc gia

```
GET /v1/api/quoc-gia/{slug}
```

### Query Parameters

- page
- limit
- year
- category

### Output (rút gọn)

```json
{
  "status": "success",
  "data": {
    "titlePage": "string",
    "items": [ ... ],
    "params": { "pagination": { ... } }
  }
}
```

---

## 8. API Năm Phát Hành

### Lấy danh sách năm

```
GET /v1/api/nam-phat-hanh
```

### Output

```json
{
  "status": "success",
  "data": [{ "_id": "string", "slug": "string", "name": "string" }]
}
```

### Lấy phim theo năm

```
GET /v1/api/nam-phat-hanh/{year}
```

### Query Parameters

- page
- limit
- category
- country

### Output (rút gọn)

```json
{
  "status": "success",
  "data": {
    "titlePage": "string",
    "items": [ ... ],
    "params": { "pagination": { ... } }
  }
}
```

---

## 9. API Chi Tiết Phim

### Endpoint

```
GET /v1/api/phim/{slug}
```

### Output (rút gọn)

```json
{
  "status": "success",
  "data": {
    "item": {
      "name": "string",
      "slug": "string",
      "content": "string",
      "poster_url": "string",
      "episodes": [ ... ],
      "tmdb": { "vote_average": number },
      "imdb": { "vote_average": number }
    }
  }
}
```

### Ghi chú

- `episodes.server_data.link_m3u8` dùng cho video player

---

## 10. API Hình Ảnh Phim

### Endpoint

```
GET /v1/api/phim/{slug}/images
```

### Dữ liệu

- image_sizes
- images (poster, backdrop)

---

## 11. API Diễn Viên / Đạo Diễn

### Endpoint

```
GET /v1/api/phim/{slug}/peoples
```

### Dữ liệu

- peoples
- profile_path (ảnh diễn viên)

---

## 12. API Từ Khoá Phim

### Endpoint

```
GET /v1/api/phim/{slug}/keywords
```

### Dữ liệu

- keywords (TMDB)

---

## 13. Ghi chú quan trọng cho Copilot

- API chỉ dùng GET
- Không cần auth
- Phim định danh bằng `slug`
- Tất cả list API đều hỗ trợ pagination
- Có thể tái sử dụng cùng một response model cho nhiều API list

---

📌 **Tài liệu này là nền tảng để Copilot triển khai:**

- API service layer
- Interfaces / Types
- Screen logic
