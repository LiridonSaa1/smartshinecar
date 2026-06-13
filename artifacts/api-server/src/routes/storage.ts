import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync } from "fs";

const router: IRouter = Router();

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(currentDir, "..", "..", "public", "uploads");

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".bin";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.post("/storage/uploads", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    const publicUrl = `/uploads/${req.file.filename}`;
    res.json({ url: publicUrl });
  } catch (err: any) {
    console.error("[storage] Upload error:", err);
    res.status(500).json({ error: "Upload failed: " + (err?.message ?? "unknown error") });
  }
});

export default router;
