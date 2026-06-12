import { Router, type IRouter, type Request, type Response } from "express";
import multer from "multer";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(currentDir, "..", "public", "uploads");

async function ensureUploadsDir() {
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }
}

ensureUploadsDir().catch(err => console.warn("[storage] Could not create uploads dir:", err));

router.post("/storage/uploads", upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    await ensureUploadsDir();

    const ext = req.file.originalname.split(".").pop()?.toLowerCase() || "bin";
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, req.file.buffer);

    const domain = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : "";
    const publicUrl = `${domain}/uploads/${fileName}`;

    res.json({ url: publicUrl });
  } catch (err) {
    console.error("[storage] Error saving file:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
