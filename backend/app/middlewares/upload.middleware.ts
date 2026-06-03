import fs from "fs";
import path from "path";
import multer from "multer";
import { AppError } from "../errors/app-error";
import { generateUploadPath } from "../utils/upload-path.util";

const uploadsRoot = path.join(process.cwd(), "uploads");

["avatars", "profile-cvs", "application-cvs"].forEach((d) => {
  const p = path.join(uploadsRoot, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(uploadsRoot, "avatars")),
  filename: (_req, file, cb) => {
    const { filename } = generateUploadPath(file.originalname, "avatar");
    cb(null, filename);
  },
});

const profileCvStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(uploadsRoot, "profile-cvs")),
  filename: (_req, file, cb) => {
    const { filename } = generateUploadPath(file.originalname, "profile-cv");
    cb(null, filename);
  },
});

const applicationCvStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(uploadsRoot, "application-cvs")),
  filename: (_req, file, cb) => {
    const { filename } = generateUploadPath(file.originalname, "application-cv");
    cb(null, filename);
  },
});

const avatarFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new AppError(400, "Avatar must be an image"));
  }
  cb(null, true);
};

const cvFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new AppError(400, "CV must be a PDF or DOCX file"));
  }
  cb(null, true);
};

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: { fileSize: 1 * 1024 * 1024 },
});

export const uploadProfileCv = multer({
  storage: profileCvStorage,
  fileFilter: cvFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadApplicationCv = multer({
  storage: applicationCvStorage,
  fileFilter: cvFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Backward-compatible alias
export const uploadCv = uploadProfileCv;
