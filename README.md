# 3 Aşağı 5 Yukarı

Bu proje, Next.js ve Socket.io kullanılarak geliştirilmiş gerçek zamanlı bir yarış ve liderlik tablosu uygulamasıdır.

## 🛠 Teknolojiler

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, Socket.io
- **Veritabanı & Önbellek:** PostgreSQL, Redis
- **Konteynerizasyon:** Docker & Docker Compose

## 🚀 Kurulum ve Çalıştırma

Projeyi çalıştırmak için iki yöntem bulunmaktadır: Docker ile (önerilen) veya manuel geliştirme ortamı kurulumu.

### Seçenek 1: Docker ile Çalıştırma (Önerilen)

Tüm sistemi (Frontend, Backend, Redis, Postgres) tek bir komutla ayağa kaldırabilirsiniz.

```bash
docker-compose up --build
```

Bu işlem tamamlandığında:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:3001](http://localhost:3001)
adreslerinden erişilebilir olacaktır.

### Seçenek 2: Manuel Geliştirme Ortamı

Geliştirme yaparken frontend ve backend'i ayrı ayrı çalıştırmak isteyebilirsiniz. Ancak Redis ve PostgreSQL'e ihtiyacınız olacaktır.

1. **Altyapı Servislerini Başlatın**
   Sadece veritabanı ve cache servislerini Docker ile başlatın:
   ```bash
   docker-compose up redis postgres -d
   ```

2. **Backend (Sunucu) Kurulumu**
   Yeni bir terminal açın ve server dizinine gidin:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   Backend 3001 portunda çalışacaktır.

3. **Frontend Kurulumu**
   Ana dizinde (root) paketleri yükleyin ve projeyi başlatın:
   ```bash
   npm install
   npm run dev
   # veya
   pnpm dev
   ```
   Frontend 3000 portunda çalışacaktır.

## 📂 Proje Yapısı

- `/src`: Next.js frontend kaynak kodları
- `/server`: Node.js/Express backend ve Socket.io sunucusu
- `docker-compose.yml`: Tüm servislerin orkestrasyonu

## 🔑 Önemli Ortam Değişkenleri

`docker-compose.yml` veya `.env` dosyasında yapılandırılan temel değişkenler:

- `NEXT_PUBLIC_SOCKET_URL`: Frontend'in bağlandığı Socket.io sunucu adresi (Varsayılan: `http://localhost:3001`)
- `REDIS_HOST` / `REDIS_PORT`: Redis bağlantı bilgileri
- `PG_USER` / `PG_PASSWORD` / `PG_DATABASE`: PostgreSQL veritabanı bilgileri
