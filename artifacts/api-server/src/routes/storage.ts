import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { getSupabaseClient } from "../lib/supabase";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

const BUCKET = "uploads";

async function ensureBucket() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some(b => b.name === BUCKET);
    if (!exists) {
      await supabase.storage.createBucket(BUCKET, {
        public: true,
        allowedMimeTypes: ["image/*"],
        fileSizeLimit: 15 * 1024 * 1024,
      });
    }
  } catch {
  }
}

ensureBucket();

router.post("/storage/uploads", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      res.status(503).json({ error: "Storage not configured — VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set" });
      return;
    }

    const ext = req.file.originalname.split(".").pop()?.toLowerCase() || "bin";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

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
  } catch (err: any) {
    console.error("[storage] Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
