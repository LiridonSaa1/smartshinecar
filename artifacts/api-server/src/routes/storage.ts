import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const router: IRouter = Router();

const BUCKET = "uploads";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key, { realtime: { transport: ws as any } });
}

async function ensureBucket() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET);
    if (!exists) {
      await supabase.storage.createBucket(BUCKET, {
        public: true,
        allowedMimeTypes: ["image/*"],
        fileSizeLimit: 15 * 1024 * 1024,
      });
    }
  } catch {}
}

ensureBucket();

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(currentDir, "..", "..", "public", "uploads");

if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.memoryStorage(),
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

    const ext = path.extname(req.file.originalname).toLowerCase() || ".bin";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error("[storage] Supabase upload error:", error.message);
        res.status(500).json({ error: "Upload failed: " + error.message });
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      res.json({ url: publicUrl });
      return;
    }

    const { writeFile } = await import("fs/promises");
    await writeFile(path.join(uploadsDir, fileName), req.file.buffer);
    res.json({ url: `/uploads/${fileName}` });
  } catch (err: any) {
    console.error("[storage] Upload error:", err);
    res.status(500).json({ error: "Upload failed: " + (err?.message ?? "unknown error") });
  }
});

export default router;
