import path from "path";

type FileType = "avatar" | "profile-cv" | "application-cv";

const FOLDER_MAP: Record<FileType, string> = {
  "avatar": "avatars",
  "profile-cv": "profile-cvs",
  "application-cv": "application-cvs",
};

function sanitizeFilename(original: string): string {
  const nameWithoutExt = path.parse(original).name;
  return nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatTimestamp(): string {
  const now = new Date();
  const pad = (n: number, len = 2) => n.toString().padStart(len, "0");
  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}-${pad(now.getMilliseconds(), 3)}`;
}

export function generateUploadPath(originalFilename: string, fileType: FileType) {
  const folder = FOLDER_MAP[fileType];
  const ext = path.extname(originalFilename).toLowerCase();
  const sanitized = sanitizeFilename(originalFilename);
  const timestamp = formatTimestamp();
  const filename = `${sanitized}-${timestamp}${ext}`;

  return {
    folder,
    filename,
    path: `uploads/${folder}/${filename}`,
    url: `/uploads/${folder}/${filename}`,
  };
}
