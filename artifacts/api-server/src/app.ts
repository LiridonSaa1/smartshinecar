import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolve public dir relative to the compiled bundle (dist/index.mjs → public/)
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(currentDir, "..", "public");

// Serve frontend static assets if the build exists
if (existsSync(publicDir)) {
  app.use(express.static(publicDir));
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", router);

// SPA fallback — return index.html for any non-API route so client-side
// routing (React Router / Wouter) works correctly on deep links.
// Uses app.use() (not app.get("*")) because path-to-regexp v8 (Express 5)
// no longer accepts bare "*" wildcards.
if (existsSync(publicDir)) {
  app.use((_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

export default app;
