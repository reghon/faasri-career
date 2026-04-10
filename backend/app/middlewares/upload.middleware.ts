import fs from "fs";
import path from "path";
import multer from "multer";
import { AppError } from "../errors/app-error";

const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const uploadsRoot = path.join(process.cwd(), "uploads");
const avatarDir = path.join(uploadsRoot, "avatars");
const cvDir = path.join(uploadsRoot, "cvs");

ensureDir(avatarDir);
ensureDir(cvDir);

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const userId = (req as any).user?.id ?? "unknown";
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${userId}-avatar-${Date.now()}${ext}`);
  },
});

const cvStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, cvDir),
  filename: (req, file, cb) => {
    const userId = (req as any).user?.id ?? "unknown";
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${userId}-cv-${Date.now()}${ext}`);
  },
});

const avatarFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new AppError(400, "Avatar must be an image"));
  }
  cb(null, true);
};

const cvFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedMimeTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new AppError(400, "CV must be a PDF or DOCX file"));
  }

  cb(null, true);
};

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
});

export const uploadCv = multer({
  storage: cvStorage,
  fileFilter: cvFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
