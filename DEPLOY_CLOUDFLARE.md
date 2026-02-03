# 🚀 Deploy AI Tutor lên Cloudflare Pages

Hướng dẫn chi tiết deploy ứng dụng AI Tutor lên Cloudflare Pages từ GitHub - **HOÀN TOÀN MIỄN PHÍ**!

## 🌟 Tại sao chọn Cloudflare Pages?

- ✅ **Miễn phí 100%** - Không giới hạn bandwidth
- ✅ **HTTPS tự động** - SSL certificate miễn phí
- ✅ **CDN toàn cầu** - Tốc độ nhanh ở mọi nơi
- ✅ **Auto deploy** - Push code là tự động deploy
- ✅ **Custom domain** - Có thể dùng tên miền riêng
- ✅ **Unlimited requests** - Không giới hạn lượt truy cập

---

## 📋 Bước 1: Chuẩn bị GitHub Repository

### 1.1. Tạo repository trên GitHub

1. Truy cập: https://github.com/new
2. Điền thông tin:
   - **Repository name**: `AITutor` (hoặc tên bạn thích)
   - **Description**: `AI Tutor - Gia sư AI giải toán và dịch tiếng Anh`
   - **Visibility**: Public (hoặc Private nếu muốn)
3. **KHÔNG** chọn "Add README" (vì đã có code rồi)
4. Click **"Create repository"**

### 1.2. Push code lên GitHub

Mở Terminal và chạy các lệnh sau:

```bash
# Di chuyển vào thư mục project
cd /Users/huongpq/Documents/AITutor/AITutor

# Kiểm tra git status
git status

# Add remote repository (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/AITutor.git

# Đổi tên branch thành main (nếu cần)
git branch -M main

# Push code lên GitHub
git push -u origin main
```

**Lưu ý:** Nếu lần đầu push, GitHub sẽ yêu cầu đăng nhập:
- Username: Tên đăng nhập GitHub
- Password: Dùng **Personal Access Token** (không phải password thường)

### 1.3. Tạo Personal Access Token (nếu cần)

1. Truy cập: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Đặt tên: `AITutor Deploy`
4. Chọn scope: `repo` (toàn bộ)
5. Click **"Generate token"**
6. **Copy token ngay** (chỉ hiện 1 lần!)
7. Dùng token này làm password khi push

---

## 📋 Bước 2: Cấu trúc thư mục cho Cloudflare

Cloudflare Pages cần deploy từ thư mục `AITutorWeb`. Chúng ta cần điều chỉnh cấu trúc:

### 2.1. Tạo file cấu hình Cloudflare

Tạo file `wrangler.toml` trong thư mục gốc:

```bash
cd /Users/huongpq/Documents/AITutor/AITutor
```

Tạo file với nội dung:

```toml
name = "ai-tutor"
compatibility_date = "2024-01-01"

[site]
bucket = "./AITutorWeb"
```

### 2.2. Commit và push thay đổi

```bash
git add wrangler.toml
git commit -m "Add Cloudflare Pages configuration"
git push
```

---

## 📋 Bước 3: Deploy lên Cloudflare Pages

### 3.1. Tạo tài khoản Cloudflare (nếu chưa có)

1. Truy cập: https://dash.cloudflare.com/sign-up
2. Đăng ký với email (miễn phí)
3. Xác nhận email

### 3.2. Kết nối GitHub với Cloudflare

1. Đăng nhập Cloudflare: https://dash.cloudflare.com
2. Vào **"Workers & Pages"** (menu bên trái)
3. Click **"Create application"**
4. Chọn tab **"Pages"**
5. Click **"Connect to Git"**
6. Click **"Connect GitHub"**
7. Authorize Cloudflare truy cập GitHub
8. Chọn repository: **"AITutor"**

### 3.3. Cấu hình Build Settings

Trong trang cấu hình:

**Project name:**
```
ai-tutor
```
(Hoặc tên bạn muốn - sẽ thành URL: `ai-tutor.pages.dev`)

**Production branch:**
```
main
```

**Build settings:**
- **Framework preset**: `None` (chọn None vì là static site)
- **Build command**: *(để trống)*
- **Build output directory**: `AITutorWeb`

**Environment variables:**
*(Không cần thiết lập gì)*

### 3.4. Deploy!

1. Click **"Save and Deploy"**
2. Đợi vài giây để Cloudflare build và deploy
3. Xem progress bar
4. Khi xong, bạn sẽ thấy: **"Success! Your site is live!"**

---

## 🎉 Bước 4: Truy cập ứng dụng

### 4.1. URL mặc định

Ứng dụng của bạn sẽ có URL:
```
https://ai-tutor.pages.dev
```
(Thay `ai-tutor` bằng project name bạn đã chọn)

### 4.2. Các trang có thể truy cập

- 🏠 Landing page: `https://ai-tutor.pages.dev/home.html`
- 🚀 App chính: `https://ai-tutor.pages.dev/index.html`
- 📖 Hướng dẫn: `https://ai-tutor.pages.dev/guide.html`
- 📱 QR Code: `https://ai-tutor.pages.dev/qr.html`

### 4.3. Chia sẻ với bạn bè

Giờ bạn có thể chia sẻ link cho bất kỳ ai:
- Mở trên điện thoại
- Mở trên máy tính
- Không cần cùng WiFi
- Có HTTPS bảo mật
- Tốc độ nhanh nhờ CDN

---

## 🔄 Bước 5: Auto Deploy (Tự động cập nhật)

Từ giờ, mỗi khi bạn push code mới lên GitHub:

```bash
# Sửa code
# ...

# Commit và push
git add .
git commit -m "Update features"
git push
```

→ Cloudflare sẽ **TỰ ĐỘNG** build và deploy phiên bản mới!

Xem tiến trình tại: https://dash.cloudflare.com → Workers & Pages → ai-tutor

---

## 🌐 Bước 6: Custom Domain (Tùy chọn)

Nếu bạn có tên miền riêng (ví dụ: `aitutor.com`):

### 6.1. Thêm Custom Domain

1. Vào Cloudflare Pages → Project của bạn
2. Tab **"Custom domains"**
3. Click **"Set up a custom domain"**
4. Nhập domain: `aitutor.com` hoặc `www.aitutor.com`
5. Follow hướng dẫn để cập nhật DNS

### 6.2. SSL/HTTPS

Cloudflare tự động cấp SSL certificate miễn phí!

---

## 📊 Bước 7: Theo dõi Analytics

### 7.1. Xem thống kê

1. Vào Cloudflare Pages → Project
2. Tab **"Analytics"**
3. Xem:
   - Số lượt truy cập
   - Bandwidth sử dụng
   - Requests per second
   - Phân bố địa lý

### 7.2. Web Analytics (Tùy chọn)

Cloudflare cung cấp Web Analytics miễn phí:
1. Vào **"Analytics & Logs"** → **"Web Analytics"**
2. Add site
3. Copy script và thêm vào `index.html`

---

## 🔧 Troubleshooting

### Lỗi: "Build failed"

**Nguyên nhân:** Build output directory sai

**Giải pháp:**
1. Vào Project Settings
2. Builds & deployments
3. Sửa **Build output directory** thành: `AITutorWeb`
4. Retry deployment

### Lỗi: "404 Not Found"

**Nguyên nhân:** Đường dẫn file sai

**Giải pháp:**
- Đảm bảo truy cập đúng: `/index.html` hoặc `/home.html`
- Kiểm tra file có trong thư mục `AITutorWeb`

### Lỗi: "API Key not found"

**Nguyên nhân:** Chưa nhập API Key

**Giải pháp:**
1. Mở app
2. Click ⚙️
3. Nhập Gemini hoặc OpenAI API Key
4. API Key được lưu trong LocalStorage của trình duyệt

### Camera không hoạt động

**Nguyên nhân:** HTTPS required cho camera API

**Giải pháp:**
- Cloudflare Pages tự động có HTTPS
- Đảm bảo truy cập qua `https://` không phải `http://`

---

## 📱 Bước 8: PWA Installation

Sau khi deploy lên Cloudflare với HTTPS, PWA sẽ hoạt động hoàn hảo:

### iPhone/iPad:
1. Mở `https://ai-tutor.pages.dev` trong Safari
2. Nhấn Share (↑)
3. "Add to Home Screen"
4. App sẽ xuất hiện như app thật!

### Android:
1. Mở trong Chrome
2. Menu (⋮)
3. "Add to Home screen"
4. Hoặc Chrome sẽ tự động hiện banner "Install App"

### Desktop (Chrome/Edge):
1. Mở web app
2. Nhấn icon ➕ trên thanh địa chỉ
3. "Install AI Tutor"

---

## 💡 Tips & Best Practices

### 1. Tối ưu Performance

Cloudflare Pages đã tự động:
- ✅ Minify HTML/CSS/JS
- ✅ Brotli compression
- ✅ HTTP/2 & HTTP/3
- ✅ Global CDN caching

### 2. Bảo mật

- ✅ HTTPS mặc định
- ✅ DDoS protection
- ✅ API Keys lưu local (không lên server)

### 3. Monitoring

Theo dõi:
- Uptime (99.99%)
- Response time
- Error rate
- Geographic distribution

### 4. Rollback

Nếu deploy lỗi:
1. Vào Deployments
2. Chọn version cũ
3. Click "Rollback to this deployment"

---

## 📞 Support & Resources

### Cloudflare Docs
- Pages: https://developers.cloudflare.com/pages
- Troubleshooting: https://developers.cloudflare.com/pages/troubleshooting

### Community
- Discord: https://discord.cloudflare.com
- Forum: https://community.cloudflare.com

### Limits (Free Plan)
- ✅ Unlimited requests
- ✅ Unlimited bandwidth
- ✅ 500 builds/month
- ✅ 1 build at a time
- ✅ 20,000 files per deployment

---

## 🎯 Checklist Deploy

- [ ] Tạo GitHub repository
- [ ] Push code lên GitHub
- [ ] Tạo tài khoản Cloudflare
- [ ] Connect GitHub với Cloudflare
- [ ] Cấu hình build settings
- [ ] Deploy thành công
- [ ] Test app trên URL live
- [ ] Nhập API Key trong app
- [ ] Test các tính năng (camera, giải toán, dịch)
- [ ] Cài đặt PWA trên điện thoại
- [ ] Chia sẻ link với bạn bè! 🎉

---

## 🚀 Quick Start Commands

```bash
# 1. Push lên GitHub
cd /Users/huongpq/Documents/AITutor/AITutor
git remote add origin https://github.com/YOUR_USERNAME/AITutor.git
git branch -M main
git push -u origin main

# 2. Sau khi sửa code
git add .
git commit -m "Your message"
git push

# 3. Cloudflare tự động deploy!
```

---

**🎉 Chúc mừng!** Bạn đã có một ứng dụng AI Tutor chạy trên internet với:
- ✅ URL riêng: `https://ai-tutor.pages.dev`
- ✅ HTTPS bảo mật
- ✅ Tốc độ cao nhờ CDN
- ✅ Miễn phí 100%
- ✅ Auto deploy khi update code

Made with 💖 by Pham Quang Huong
