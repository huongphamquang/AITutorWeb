# 🌸 Gia Sư AI - Web Version 🌸

Progressive Web App (PWA) cho ứng dụng AI Tutor - Giải toán và dịch tiếng Anh thông minh.

## ✨ Tính năng

### 📚 Học tập
- ✅ **Giải toán**: Giải chi tiết các bài toán Toán, Lý, Hóa với từng bước
- ✅ **Vẽ hình học**: Tự động vẽ hình minh họa cho bài toán hình học
- ✅ **Dịch tiếng Anh**: Trích xuất từ vựng, nghĩa và câu ví dụ
- ✅ **Text-to-Speech**: Phát âm từ vựng tiếng Anh
- ✅ **Feedback**: Yêu cầu giải lại hoặc giải theo cách khác

### 🎯 Cài đặt
- 📱 Chọn lớp (1-12)
- 🤖 Chọn AI Provider (Gemini hoặc ChatGPT)
- 🔑 Quản lý API Keys (lưu local)

### 📸 Nhập liệu
- 📷 Chụp ảnh trực tiếp từ camera
- 🖼️ Upload ảnh từ thư viện
- 📝 Thêm ghi chú cho gia sư

### 🎨 Giao diện
- 💅 Thiết kế đẹp mắt, hiện đại
- 📱 Responsive, tối ưu cho mobile
- 🌙 Theme màu hồng/tím dễ thương
- ✨ Animations mượt mà
- 🎭 Progressive Web App (có thể cài đặt)

## 🚀 Cách sử dụng

### 1. Chuẩn bị API Key

Bạn cần có ít nhất một trong hai API keys:

#### Gemini API Key (Khuyên dùng - Miễn phí)
1. Truy cập: https://aistudio.google.com/apikey
2. Đăng nhập với Google Account
3. Tạo API Key mới
4. Copy API Key

#### OpenAI API Key
1. Truy cập: https://platform.openai.com/api-keys
2. Đăng nhập hoặc tạo tài khoản
3. Tạo API Key mới
4. Copy API Key (có phí sử dụng)

### 2. Chạy ứng dụng

#### Cách 1: Sử dụng Python HTTP Server
```bash
cd AITutorWeb
python3 -m http.server 8000
```
Sau đó mở trình duyệt: http://localhost:8000

#### Cách 2: Sử dụng Node.js HTTP Server
```bash
cd AITutorWeb
npx http-server -p 8000
```
Sau đó mở trình duyệt: http://localhost:8000

#### Cách 3: Sử dụng Live Server (VS Code Extension)
1. Cài đặt extension "Live Server" trong VS Code
2. Click phải vào file `index.html`
3. Chọn "Open with Live Server"

### 3. Cài đặt API Key
1. Click vào icon ⚙️ ở góc phải
2. Nhập Gemini API Key hoặc OpenAI API Key
3. Click "Lưu"

### 4. Sử dụng
1. **Chọn lớp** của bạn (1-12)
2. **Chọn AI Provider** (Gemini hoặc ChatGPT)
3. **Chụp ảnh** hoặc **chọn ảnh** bài toán/từ vựng
4. (Tùy chọn) Thêm ghi chú cho gia sư
5. Click **"Giải bài!"**
6. Xem kết quả với lời giải chi tiết
7. (Tùy chọn) Gửi feedback để yêu cầu giải lại

## 📱 Cài đặt như App

### Trên iOS (iPhone/iPad)
1. Mở web app trong Safari
2. Nhấn nút "Share" (biểu tượng mũi tên lên)
3. Chọn "Add to Home Screen"
4. Đặt tên và nhấn "Add"

### Trên Android
1. Mở web app trong Chrome
2. Nhấn menu (3 chấm)
3. Chọn "Add to Home screen" hoặc "Install app"
4. Xác nhận cài đặt

### Trên Desktop (Chrome, Edge)
1. Mở web app
2. Nhấn icon ➕ hoặc 🔽 trên thanh địa chỉ
3. Chọn "Install"

## 🛠️ Công nghệ sử dụng

- **HTML5**: Cấu trúc semantic, accessibility
- **CSS3**: Custom properties, animations, responsive design
- **JavaScript ES6+**: Async/await, classes, modules
- **PWA**: Service Worker, Web App Manifest
- **APIs**:
  - Google Gemini API (gemini-2.0-flash)
  - OpenAI API (gpt-4o)
  - Web Speech API (Text-to-Speech)
  - Canvas API (Vẽ hình học)
  - File API (Upload ảnh)
  - LocalStorage API (Lưu settings)

## 📂 Cấu trúc dự án

```
AITutorWeb/
├── index.html          # Giao diện chính
├── styles.css          # Styles và animations
├── app.js              # Logic ứng dụng
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
└── README.md           # Tài liệu này
```

## 🔒 Bảo mật

- API Keys được lưu trong **LocalStorage** của trình duyệt
- Không gửi API Keys lên server
- Tất cả xử lý đều ở client-side
- Khuyến nghị: Không chia sẻ API Keys với người khác

## 🌐 Trình duyệt hỗ trợ

- ✅ Chrome/Edge (Desktop & Mobile) - Khuyên dùng
- ✅ Safari (iOS & macOS)
- ✅ Firefox (Desktop & Mobile)
- ✅ Samsung Internet
- ⚠️ Các trình duyệt cũ có thể không hỗ trợ đầy đủ

## 📝 Lưu ý

1. **Kết nối Internet**: Cần internet để gọi API
2. **Camera**: Cần cấp quyền camera để chụp ảnh
3. **API Limits**: 
   - Gemini: Free tier có giới hạn requests/phút
   - OpenAI: Tính phí theo usage
4. **Độ chính xác**: Phụ thuộc vào chất lượng ảnh và AI model

## 🐛 Xử lý lỗi thường gặp

### "Vui lòng nhập API Key"
→ Chưa cài đặt API Key. Click ⚙️ để nhập key.

### "Gemini API error" / "OpenAI API error"
→ Kiểm tra:
- API Key có đúng không
- Đã bật billing cho OpenAI chưa (nếu dùng ChatGPT)
- Kết nối internet

### "Không thể phân tích kết quả"
→ AI trả về format không đúng. Thử lại hoặc đổi provider.

### Camera không hoạt động
→ Cấp quyền camera cho trình duyệt trong Settings.

## 👨‍💻 Tác giả

**Pham Quang Huong**

## 📄 License

Personal use only.

---

Made with 💖 by Pham Quang Huong
