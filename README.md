# Faasri Career

Platform rekrutmen dan manajemen karir untuk Faasri. Aplikasi ini memungkinkan pelamar untuk membuat profil, mengunggah CV, dan melamar pekerjaan. Sisi manajemen dapat mengelola lowongan, melihat pelamar, dan mengatur status lamaran.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Angular 21, TailwindCSS, DaisyUI |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL 16 |
| File Storage | Docker Named Volume (`uploads_data`) |
| Reverse Proxy | Nginx (di dalam container frontend) |
| Containerization | Docker, Docker Compose |

---

## Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                         │
│                                                          │
│  ┌──────────────┐     ┌──────────────┐    ┌──────────┐ │
│  │   frontend   │     │   backend    │    │ postgres │ │
│  │  (nginx:80)  │────▶│  (node:3000) │───▶│  (:5432) │ │
│  │              │     │              │    │          │ │
│  │  SPA files   │     │  /api/*      │    │          │ │
│  │  /api/* proxy│     │  /uploads/*  │    │          │ │
│  │  /uploads/*  │     │  /health     │    │          │ │
│  └──────────────┘     └──────┬───────┘    └────┬─────┘ │
│        :80                   │                  │       │
│                       ┌──────┴───────┐   ┌─────┴─────┐ │
│                       │ uploads_data │   │postgres_data│ │
│                       │   (volume)   │   │  (volume)  │ │
│                       └──────────────┘   └───────────┘ │
└─────────────────────────────────────────────────────────┘
```

**Alur request:**

1. Browser mengakses `:80` → Nginx (frontend container)
2. Request ke `/api/*` atau `/uploads/*` → di-proxy ke `backend:3000`
3. Request lainnya → Angular SPA (`index.html`)

---

## Struktur Folder

```
faasri_career/
├── backend/
│   ├── app/
│   │   ├── configurations/    # Database, env config
│   │   ├── db/                # Migrations & seeds
│   │   ├── errors/            # Custom error classes
│   │   ├── middlewares/       # Auth, upload, validation
│   │   ├── modules/           # Feature modules (applicant, job, apply, dll)
│   │   ├── types/             # TypeScript type declarations
│   │   └── utils/             # Shared utilities
│   ├── uploads/               # File storage (mounted volume)
│   ├── .env.example           # Template environment variables
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Config, interceptors, guards
│   │   │   ├── domain/        # Services & models
│   │   │   ├── features/      # Page components
│   │   │   └── shared/        # Reusable components
│   │   └── environments/      # Environment config
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── scripts/
│   └── migrate-uploads.ts     # Migrasi file upload lama
├── .dockerignore
├── .env.example               # Template env untuk Docker Compose
├── docker-compose.yml
├── pnpm-lock.yaml             # Lockfile tunggal (workspace)
├── pnpm-workspace.yaml
└── README.md
```

---

## Prasyarat

| Software | Versi Minimum |
|----------|---------------|
| Docker | 24+ |
| Docker Compose | v2+ |
| Node.js | 20+ (untuk development lokal) |
| pnpm | 10+ (untuk development lokal) |

---

## Environment Variables

### `.env` (root — untuk Docker Compose)

Digunakan oleh service `postgres` dan interpolasi `DATABASE_URL` di `docker-compose.yml`.

```env
DB_USER=faasri
DB_PASSWORD=your_password
DB_NAME=faasri_career
```

### `backend/.env`

```env
# Database
DB_HOST=localhost          # "localhost" untuk dev lokal, Docker override ke "postgres"
DB_PORT=5432
DB_USER=faasri
DB_PASSWORD=your_password
DB_NAME=faasri_career
DATABASE_URL=postgres://faasri:your_password@localhost:5434/faasri_career

# Application
PORT=3000

# JWT
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=30d

# Password Hashing
BCRYPT_SALT_ROUNDS=10

# Email (untuk OTP & notifikasi)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS
CLIENT_URL=http://localhost:4200
```

> ⚠️ **Penting:** Jangan commit file `.env` ke repository. Gunakan `.env.example` sebagai template.

> **Catatan:** Saat dijalankan via Docker Compose, `DB_HOST` dan `DATABASE_URL` di-override otomatis ke `postgres` (nama service). Tidak perlu ubah `backend/.env` untuk Docker.

---

## Development Lokal

### Database

Jalankan PostgreSQL menggunakan Docker:

```bash
docker compose up postgres -d
```

Database tersedia di `localhost:5434`.

### Backend

```bash
cd backend
pnpm install
pnpm dev
```

Backend berjalan di `http://localhost:3000`.

### Frontend

```bash
cd frontend
pnpm install
npx ng serve
```

Frontend berjalan di `http://localhost:4200`. Dalam mode development, API request diarahkan ke `http://localhost:3000`.

### Migrasi Database

```bash
cd backend
pnpm run migrate
```

### Seed Data

```bash
cd backend
pnpm run seed
```

### Install/Update Package

Karena menggunakan pnpm workspace, lockfile hanya ada di root:

```bash
# Tambah package di backend
cd backend
pnpm add <package-name>

# Tambah package di frontend
cd frontend
pnpm add <package-name>
```

Lockfile di root (`pnpm-lock.yaml`) akan terupdate otomatis.

---

## Docker (Production Mode di Lokal)

### Build & jalankan semua service

```bash
docker compose up --build
```

Akses di `http://localhost` (port 80).

### Jalankan di background

```bash
docker compose up --build -d
```

### Lihat logs

```bash
# Semua service
docker compose logs -f

# Service tertentu
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Stop

```bash
# Stop (data tetap aman)
docker compose down

# Stop & hapus semua data (BERBAHAYA)
docker compose down -v
```

---

## Deployment Production

### Langkah-langkah

```bash
# 1. Pull kode terbaru
git pull origin main

# 2. Build dan deploy
docker compose up --build -d

# 3. Jalankan migrasi database (jika ada perubahan schema)
docker compose exec backend node dist/db/migrate.js
# 4. Jalankan seeder (jika perlu data awal)
docker compose exec backend node dist/db/seed.js
```

### Verifikasi

```bash
# Frontend accessible
curl http://localhost

# Backend health
curl http://localhost:3000/health

# Database
docker compose exec postgres pg_isready -U faasri
```

---

## Health Check

Backend menyediakan endpoint health check:

```
GET /health
```

**Response:**

```json
{
  "status": "ok"
}
```

Docker Compose menggunakan healthcheck ini untuk memastikan backend siap sebelum frontend container start.

---

## Upload Storage

### Struktur folder

```
uploads/
├── avatars/            # Foto profil pelamar
├── profile-cvs/        # CV di profil pelamar
└── application-cvs/    # Salinan CV saat melamar pekerjaan
```

### Format penamaan file

```
{nama-file-asli-sanitized}-{DD}-{MM}-{YYYY}-{HH}-{mm}-{ss}-{ms}.{ext}
```

### Persistensi

File upload disimpan di Docker named volume `uploads_data` yang di-mount ke `/app/backend/uploads` di dalam container backend. Volume ini **tetap ada** meskipun container di-rebuild atau di-restart.

---

## Database Persistence

Data PostgreSQL disimpan di Docker named volume `postgres_data`. Data tetap aman saat:
- `docker compose down` → volume dipertahankan
- `docker compose up --build` → container baru, volume yang sama

Data **hanya hilang** jika menjalankan `docker compose down -v`.

---

## Backup & Restore

### Backup Uploads

```bash
docker run --rm \
  -v faasri_career_uploads_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/uploads-backup-$(date +%Y%m%d).tar.gz -C /data .
```

### Restore Uploads

```bash
docker run --rm \
  -v faasri_career_uploads_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/uploads-backup-20260603.tar.gz -C /data
```

### Backup Database

```bash
docker compose exec postgres pg_dump -U faasri faasri_career > backup-$(date +%Y%m%d).sql
```

### Restore Database

```bash
docker compose exec -T postgres psql -U faasri faasri_career < backup-20260603.sql
```

---

## Troubleshooting

### Frontend tidak bisa mengakses backend

1. Pastikan backend sudah sehat: `docker compose logs backend`
2. Periksa health check: `curl http://localhost:3000/health`
3. Pastikan nama service di `nginx.conf` sesuai dengan `docker-compose.yml`

### Angular route refresh mengembalikan 404

Nginx sudah dikonfigurasi dengan `try_files $uri $uri/ /index.html`. Verifikasi:

```bash
docker compose exec frontend cat /etc/nginx/conf.d/default.conf
```

### File upload hilang setelah rebuild

1. Pastikan volume `uploads_data` terdefinisi di `docker-compose.yml`
2. Jangan gunakan `docker compose down -v` di production
3. Verifikasi: `docker volume inspect faasri_career_uploads_data`

### Database connection error

1. Di Docker: `DB_HOST` di-override ke `postgres` via docker-compose environment
2. Di lokal: pastikan `DB_HOST=localhost` dan `DB_PORT=5432` di `backend/.env`, postgres jalan di port `5434`
3. Periksa status: `docker compose logs postgres`

---

## Security Notes

- Semua secret disimpan di file `.env` yang tidak di-commit
- File upload divalidasi MIME type (avatar: image/*, max 1MB; CV: PDF/DOCX, max 2MB)
- Path traversal dicegah dengan sanitasi nama file
- Backend berjalan sebagai non-root user (`appuser`) di container
- Nginx sebagai reverse proxy menyembunyikan backend dari akses langsung
- Gunakan HTTPS (certbot/Let's Encrypt) untuk production

---

## Maintenance

### Rebuild container tertentu

```bash
docker compose up --build -d backend
docker compose up --build -d frontend
```

### Bersihkan image yang tidak terpakai

```bash
docker image prune -f
```

### Masuk ke container untuk debugging

```bash
docker compose exec backend sh
docker compose exec frontend sh
docker compose exec postgres psql -U faasri faasri_career
```

---

## Lisensi

Private — Hak cipta Faasri.
