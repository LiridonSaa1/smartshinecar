import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync } from "fs";
import sharp from "sharp";

const router: IRouter = Router();

const MAX_WIDTH = 2560;
const MAX_HEIGHT = 1600;
const WEBP_QUALITY = 90;

async function optimizeImage(buffer: Buffer, originalMime: string): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  try {
    const img = sharp(buffer);
    const meta = await img.metadata();

    const needsResize = (meta.width ?? 0) > MAX_WIDTH || (meta.height ?? 0) > MAX_HEIGHT;

    let pipeline = needsResize
      ? img.resize(MAX_WIDTH, MAX_HEIGHT, { fit: "inside", withoutEnlargement: true })
      : img;

    const isGif = originalMime === "image/gif";
    if (isGif) {
      const out = await pipeline.toBuffer();
      return { buffer: out, mime: "image/gif", ext: ".gif" };
    }

    const out = await pipeline.webp({ quality: WEBP_QUALITY, effort: 4 }).toBuffer();
    return { buffer: out, mime: "image/webp", ext: ".webp" };
  } catch (err) {
    console.warn("[storage] sharp failed, using original:", err);
    const ext = originalMime === "image/png" ? ".png" : ".jpg";
    return { buffer, mime: originalMime, ext };
  }
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(currentDir, "..", "..", "public", "uploads");

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
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

    const { buffer: optimized, mime, ext } = await optimizeImage(req.file.buffer, req.file.mimetype);
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    console.log(
      `[storage] Optimized: ${(req.file.size / 1024).toFixed(0)}KB → ${(optimized.length / 1024).toFixed(0)}KB (${ext})`
    );

    const { writeFile } = await import("fs/promises");
    await writeFile(path.join(uploadsDir, fileName), optimized);
    res.json({ url: `/uploads/${fileName}` });
  } catch (err: any) {
    console.error("[storage] Upload error:", err);
    res.status(500).json({ error: "Upload failed: " + (err?.message ?? "unknown error") });
  }
});

export default router;
