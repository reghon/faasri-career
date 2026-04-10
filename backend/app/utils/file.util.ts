import fs from "fs";
import path from "path";

export const deleteUploadedFile = (fileUrl: string | null | undefined): void => {
  if (!fileUrl) return;
  if (!fileUrl.startsWith("/uploads/")) return;

  const normalizedPath = fileUrl.replace(/^\/+/, "");
  const absolutePath = path.join(process.cwd(), normalizedPath);

  if (!absolutePath.startsWith(path.join(process.cwd(), "uploads"))) {
    return;
  }

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};
