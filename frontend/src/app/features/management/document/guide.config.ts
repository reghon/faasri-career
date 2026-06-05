export interface GuideSection {
  id: string;
  title: string;
  permission?: string;
  children: GuideChild[];
}

export interface GuideChild {
  id: string;
  title: string;
  content: string;
  bullets?: string[];
  permission?: string;
  imageUrl?: string;
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    children: [
      {
        id: 'login',
        title: 'Login',
        content:
          'Masuk ke sistem menggunakan email dan password yang telah didaftarkan oleh admin.',
        bullets: [
          'Buka halaman /login',
          'Masukkan email dan password',
          'Klik tombol "Login"',
          'Jika berhasil, Anda akan diarahkan ke Dashboard',
          'Jika gagal, pesan error akan ditampilkan',
        ],
        imageUrl: 'document/login.png',
      },
      {
        id: 'forgot-password',
        title: 'Forgot Password',
        content:
          'Reset password jika Anda lupa kredensial akun.',
        bullets: [
          'Klik "Forgot Password" di halaman login',
          'Masukkan email yang terdaftar',
          'Sistem akan mengirimkan kode OTP ke email Anda',
          'Gunakan OTP untuk verifikasi dan membuat password baru',
        ],
        imageUrl: 'document/forgot-password.png',
      },
      {
        id: 'otp',
        title: 'OTP Verification',
        content:
          'Verifikasi identitas dengan kode OTP yang dikirim ke email.',
        bullets: [
          'Cek inbox email (atau folder spam) untuk kode OTP',
          'Masukkan 6 digit kode OTP',
          'Kode berlaku dalam waktu terbatas',
          'Jika expired, request ulang OTP baru',
        ],
        imageUrl: 'document/otp.png',
      },
      {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        content:
          'Dashboard menampilkan ringkasan data rekrutmen secara real-time.',
        bullets: [
          'Summary cards: total job aktif, pelamar, lamaran baru',
          'Recruitment Funnel: visualisasi pipeline dari applied hingga hired',
          'Hiring Insight: statistik per departemen dan kategori',
          'Smart Insight: rekomendasi dan alert otomatis dari sistem',
        ],
        imageUrl: 'document/dashboard.png',
      },
    ],
  },
  {
    id: 'job-management',
    title: 'Job Management',
    permission: 'JOB_LIST',
    children: [
      {
        id: 'create-job',
        title: 'Create Job',
        permission: 'JOB_CREATE',
        content:
          'Buat lowongan baru melalui tombol "Tambah Baru" di halaman Job.',
        bullets: [
          'Basic Info: judul posisi, kategori, departemen, level pendidikan minimum',
          'Location: pilih lokasi kantor dan mode kerja (On-site/Remote/Hybrid)',
          'Compensation: range gaji dan tipe employment (Full-time/Part-time/Contract)',
          'Content: deskripsi pekerjaan, requirement, dan benefit',
          'Publication: tanggal publikasi, tanggal tutup, dan status awal (Draft/Open)',
          'PIC: person in charge yang bertanggung jawab atas lowongan ini',
        ],
        imageUrl: 'document/create-job.png',
      },
      {
        id: 'edit-job',
        title: 'Edit Job',
        permission: 'JOB_UPDATE',
        content:
          'Edit lowongan yang sudah ada untuk mengubah informasi atau status.',
        bullets: [
          'Klik icon edit pada baris job di tabel',
          'Semua field dapat diubah termasuk status',
          'Ubah status ke "Open" untuk mempublikasikan',
          'Ubah status ke "Closed" untuk menutup penerimaan',
          'Perubahan langsung tersimpan setelah submit',
        ],
        imageUrl: 'document/edit-job.png',
      },
      {
        id: 'job-detail',
        title: 'Job Detail',
        permission: 'JOB_READ',
        content:
          'Lihat detail lengkap lowongan beserta kandidat yang melamar.',
        bullets: [
          'Informasi lengkap: deskripsi, requirement, lokasi, kompensasi',
          'Status lowongan saat ini',
          'Daftar kandidat yang melamar ke posisi ini',
          'Quick action untuk mengubah status kandidat',
        ],
        imageUrl: 'document/job-detail.png',
      },
      {
        id: 'job-candidate',
        title: 'Job Candidates',
        permission: 'JOB_READ',
        content:
          'Kelola kandidat yang melamar ke lowongan tertentu.',
        bullets: [
          'Lihat semua pelamar pada lowongan spesifik',
          'Status terkini setiap kandidat ditampilkan',
          'Pindahkan status kandidat langsung dari halaman ini',
          'Akses detail profil dan CV kandidat',
        ],
        imageUrl: 'document/job-candidate.png',
      },
    ],
  },
  {
    id: 'applicant-management',
    title: 'Applicant Management',
    permission: 'APPLICANT_LIST',
    children: [
      {
        id: 'applicant-list',
        title: 'Applicant List',
        permission: 'APPLICANT_LIST',
        content:
          'Daftar semua pelamar yang terdaftar di sistem.',
        bullets: [
          'Tabel menampilkan: nama, email, telepon, status akun',
          'Fitur pencarian berdasarkan nama atau email',
          'Klik eye icon untuk melihat detail pelamar',
          'Pagination untuk navigasi data banyak',
        ],
        imageUrl: 'document/applicant-list.png',
      },
      {
        id: 'applicant-detail',
        title: 'Applicant Detail',
        permission: 'APPLICANT_READ',
        content:
          'Profil lengkap pelamar dengan semua informasi yang telah diisi.',
        bullets: [
          'Data pribadi: nama, TTL, gender, telepon, email, LinkedIn',
          'Riwayat pendidikan: institusi, jurusan, tahun, IPK',
          'Pengalaman kerja: perusahaan, posisi, durasi, tanggung jawab',
          'Sertifikasi: nama sertifikat, penerbit, masa berlaku',
          'Technical Skills: daftar keahlian teknis',
          'Bahasa: bahasa yang dikuasai beserta tingkat kemahiran',
        ],
        imageUrl: 'document/applicant-detail.png',
      },
      {
        id: 'applicant-applications',
        title: 'Riwayat Lamaran Pelamar',
        permission: 'APPLICANT_READ',
        content:
          'Tab "Lamaran" pada detail pelamar menampilkan semua lamaran.',
        bullets: [
          'Daftar semua posisi yang pernah dilamar',
          'Status terkini setiap lamaran',
          'Expand untuk melihat timeline rekrutmen',
          'Klik untuk navigasi ke detail application',
        ],
        imageUrl: 'document/applicant-detail-application-list.png',
      },
    ],
  },
  {
    id: 'application-management',
    title: 'Application Management',
    permission: 'APPLICATION_LIST',
    children: [
      {
        id: 'application-list',
        title: 'Application List',
        permission: 'APPLICATION_LIST',
        content:
          'Halaman daftar semua lamaran yang masuk ke sistem.',
        bullets: [
          'Filter berdasarkan: nama job, status lamaran',
          'Pencarian berdasarkan nama pelamar',
          'Sorting berdasarkan tanggal atau status',
          'Tabel menampilkan: nama pelamar, posisi, tanggal melamar, status',
          'Eye icon untuk melihat detail lamaran',
          'Dropdown action untuk mengubah status',
        ],
        imageUrl: 'document/application-list.png',
      },
      {
        id: 'change-status',
        title: 'Change Application Status',
        permission: 'APPLICATION_UPDATE',
        content:
          'Ubah status lamaran kandidat melalui halaman detail atau dropdown action.',
        bullets: [
          'Alur status: Submitted → Screening → Interview → Technical Test → Offered → Hired/Rejected',
          'Tambahkan catatan/notes pada setiap perubahan status',
          'Timeline rekrutmen menampilkan seluruh riwayat perubahan',
          'Status "Hired" dan "Rejected" adalah status final',
          'Kandidat juga dapat "Withdrawn" (mengundurkan diri)',
        ],
        imageUrl: 'document/change-status.png',
      },
    ],
  },
  {
    id: 'master-data',
    title: 'Master Data',
    permission: 'MASTER_DATA_LIST',
    children: [
      {
        id: 'job-locations',
        title: 'Job Locations',
        permission: 'MASTER_DATA_READ',
        content:
          'Kelola daftar lokasi kerja yang tersedia untuk lowongan.',
        bullets: [
          'Field: code, nama, kota, provinsi, negara, alamat, kode pos',
          'Digunakan saat membuat/edit lowongan',
          'Dapat ditambah, diedit, dan dihapus',
        ],
        imageUrl: 'document/master-job-loc.png',
      },
      {
        id: 'job-categories',
        title: 'Job Categories',
        permission: 'MASTER_DATA_READ',
        content:
          'Kategori pekerjaan untuk mengelompokkan lowongan.',
        bullets: [
          'Contoh: Information Technology, Marketing, Finance, HR',
          'Field: code, nama, deskripsi',
          'Tampil sebagai filter di halaman job publik',
        ],
        imageUrl: 'document/master-job-category.png',
      },
      {
        id: 'departments',
        title: 'Departments',
        permission: 'MASTER_DATA_READ',
        content:
          'Daftar departemen perusahaan.',
        bullets: [
          'Mengidentifikasi unit kerja pada setiap lowongan',
          'Field: code, nama, deskripsi',
          'Digunakan di form create/edit job',
        ],
        imageUrl: 'document/master-department.png',
      },
      {
        id: 'employment-types',
        title: 'Employment Types',
        permission: 'MASTER_DATA_READ',
        content:
          'Tipe pekerjaan yang tersedia.',
        bullets: [
          'Full-time, Part-time, Contract, Internship, Freelance',
          'Field: code, nama, deskripsi',
          'Dipilih saat membuat lowongan',
        ],
        imageUrl: 'document/master-employment-types.png',
      },
      {
        id: 'work-modes',
        title: 'Work Modes',
        permission: 'MASTER_DATA_READ',
        content:
          'Mode kerja yang tersedia.',
        bullets: [
          'On-site: bekerja di kantor',
          'Remote: bekerja dari rumah/jarak jauh',
          'Hybrid: kombinasi on-site dan remote',
        ],
        imageUrl: 'document/master-work-modes.png',
      },
      {
        id: 'education-levels',
        title: 'Education Levels',
        permission: 'MASTER_DATA_READ',
        content:
          'Jenjang pendidikan minimum untuk requirement lowongan.',
        bullets: [
          'SMA/SMK, D3, S1, S2, S3',
          'Ditampilkan pada detail lowongan sebagai requirement',
          'Pelamar mengisi jenjang pendidikan di profil',
        ],
        imageUrl: 'document/master-education-level.png',
      },
      {
        id: 'job-statuses',
        title: 'Job Statuses',
        permission: 'MASTER_DATA_READ',
        content:
          'Status lowongan yang menentukan visibilitas di halaman publik.',
        bullets: [
          'Draft: belum dipublikasikan, tidak tampil di publik',
          'Open: menerima lamaran, tampil di halaman publik',
          'Paused: dihentikan sementara',
          'Closed: tidak menerima lamaran lagi',
          'Filled: posisi sudah terisi oleh kandidat',
        ],
        imageUrl: 'document/master-job-status.png',
      },
      {
        id: 'apply-statuses',
        title: 'Apply Statuses',
        permission: 'MASTER_DATA_READ',
        content:
          'Status lamaran yang membentuk pipeline rekrutmen.',
        bullets: [
          'Submitted: lamaran baru masuk',
          'Screening: seleksi awal oleh HR',
          'Interview: tahap wawancara',
          'Technical Test: tes teknis/assessment',
          'Offered: penawaran kerja diberikan',
          'Hired: kandidat resmi diterima (final)',
          'Rejected: kandidat tidak lolos (final)',
          'Withdrawn: kandidat mengundurkan diri',
        ],
        imageUrl: 'document/master-apply-status.png',
      },
    ],
  },
  {
    id: 'admin-management',
    title: 'Admin Management',
    permission: 'ADMIN_LIST',
    children: [
      {
        id: 'manage-users',
        title: 'Users',
        permission: 'ADMIN_READ',
        content:
          'Kelola akun user management sistem.',
        bullets: [
          'Tambah user baru: isi Full Name, Email, Password, pilih Role',
          'Sistem otomatis membuat management profile',
          'Edit user: ubah email, role, atau reset password',
          'Nonaktifkan user dengan toggle status Active',
          'Soft delete: user dipindahkan ke Trash, bisa di-restore',
          'Role "Applicant" tidak tampil (otomatis via registrasi)',
        ],
        imageUrl: 'document/admin-user.png',
      },
      {
        id: 'manage-roles',
        title: 'Roles',
        permission: 'ADMIN_READ',
        content:
          'Kelola role yang tersedia di sistem.',
        bullets: [
          'Setiap role memiliki code unik (contoh: HR_ADMIN, RECRUITER)',
          'Field: code, nama, deskripsi, flag superadmin, status active',
          'Superadmin otomatis memiliki semua permission',
          'Role dapat di-soft delete dan di-restore',
          'Role yang sedang digunakan tidak dapat dihapus',
        ],
        imageUrl: 'document/admin-role.png',
      },
      {
        id: 'rbac-matrix',
        title: 'RBAC Matrix',
        permission: 'ADMIN_READ',
        content:
          'Atur permission setiap role dengan matrix interaktif.',
        bullets: [
          'Pilih role dari dropdown',
          'Matrix menampilkan: module (baris) × action (kolom)',
          'Modules: Job, Applicant, Application, Master Data, Admin',
          'Actions: Create, Read, Update, Delete',
          'Checkbox "Tandai Semua" untuk toggle semua action per module',
          'Klik Save untuk menyimpan perubahan',
          'Klik Reset untuk membatalkan perubahan yang belum disimpan',
        ],
        imageUrl: 'document/admin-rbac.png',
      },
    ],
  },
  {
    id: 'profile',
    title: 'Profile',
    children: [
      {
        id: 'management-profile',
        title: 'Management Profile',
        content:
          'Halaman profil untuk user management.',
        bullets: [
          'Akses melalui dropdown avatar di navbar → Profile',
          'Edit nama lengkap Anda',
          'Perubahan langsung tersimpan setelah submit',
        ],
        imageUrl: 'document/management-profile.png',
      },
    ],
  },
  {
    id: 'trash-mode',
    title: 'Trash Mode',
    children: [
      {
        id: 'trash-mode-overview',
        title: 'Trash Mode',
        content:
          'Fitur Trash Mode tersedia di halaman Master Data dan Admin.',
        bullets: [
          'Klik tombol "Trash" untuk masuk ke mode trash',
          'Menampilkan semua data yang telah di-soft delete',
          'Restore: kembalikan data ke daftar aktif',
          'Permanent Delete: hapus data secara permanen (tidak bisa dikembalikan)',
          'Klik "Kembali" untuk keluar dari Trash Mode',
          'Data yang di-restore akan langsung aktif kembali',
        ],
        imageUrl: 'document/master-trash-mode.png',
      },
    ],
  },
];
