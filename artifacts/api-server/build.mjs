import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm, cp } from "node:fs/promises";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

// Plugins (e.g. 'esbuild-plugin-pino') may use `require` to resolve dependencies
globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));

async function buildFrontend() {
  const carWashDir = path.resolve(artifactDir, "../car-wash");
  if (!existsSync(carWashDir)) {
    console.log("car-wash directory not found, skipping frontend build.");
    return;
  }

  // Detect whether the pnpm virtual store is actually populated
  // (pnpm-workspace.yaml may exist on Render too, but packages won't be installed)
  const workspaceRoot = path.resolve(artifactDir, "../..");
  const pnpmStoreDir = path.join(workspaceRoot, "node_modules", ".pnpm");
  const pnpmInstalled = existsSync(pnpmStoreDir);
  const buildEnv = { ...process.env, BASE_PATH: "/" };

  if (pnpmInstalled) {
    // Packages already managed by pnpm (Replit dev) — run vite directly
    console.log("🏗️  Building frontend (pnpm workspace)...");
    execSync("pnpm exec vite build --config vite.config.ts", {
      cwd: carWashDir,
      stdio: "inherit",
      env: buildEnv,
    });
  } else {
    // Clean npm environment (Render) — install then build
    console.log("📦 Installing frontend dependencies...");
    execSync("npm install --ignore-scripts", {
      cwd: carWashDir,
      stdio: "inherit",
    });
    console.log("🏗️  Building frontend...");
    execSync("npm run build", {
      cwd: carWashDir,
      stdio: "inherit",
      env: buildEnv,
    });
  }

  const frontendDist = path.resolve(carWashDir, "dist");
  const publicDir = path.resolve(artifactDir, "public");

  console.log("📂 Copying frontend build → public/...");
  await rm(publicDir, { recursive: true, force: true });
  await cp(frontendDist, publicDir, { recursive: true });
  console.log("✅ Frontend ready.");
}

async function buildAll() {
  // 1. Build the React frontend first
  await buildFrontend();

  // 2. Build the Express backend with esbuild
  const distDir = path.resolve(artifactDir, "dist");
  await rm(distDir, { recursive: true, force: true });

  const workspaceRoot = path.resolve(artifactDir, "../..");
  const dbRoot = path.join(workspaceRoot, "lib/db/src");

  await esbuild({
    entryPoints: [path.resolve(artifactDir, "src/index.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: distDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    alias: {
      "@workspace/db": path.join(dbRoot, "index.ts"),
      "@workspace/db/schema": path.join(dbRoot, "schema/index.ts"),
    },
    nodePaths: [
      path.resolve(artifactDir, "node_modules"),
      path.resolve(artifactDir, "../../node_modules"),
    ],
    external: [
      "*.node",
      "multer",
      "bcryptjs",
      "jsonwebtoken",
      "zod",
      "sharp",
      "better-sqlite3",
      "sqlite3",
      "canvas",
      "bcrypt",
      "argon2",
      "fsevents",
      "re2",
      "farmhash",
      "xxhash-addon",
      "bufferutil",
      "utf-8-validate",
      "ssh2",
      "cpu-features",
      "dtrace-provider",
      "isolated-vm",
      "lightningcss",
      "pg-native",
      "oracledb",
      "mongodb-client-encryption",
      "nodemailer",
      "handlebars",
      "knex",
      "typeorm",
      "protobufjs",
      "onnxruntime-node",
      "@tensorflow/*",
      "@prisma/client",
      "@mikro-orm/*",
      "@grpc/*",
      "@swc/*",
      "@aws-sdk/*",
      "@azure/*",
      "@opentelemetry/*",
      "@google-cloud/*",
      "@google/*",
      "googleapis",
      "firebase-admin",
      "@parcel/watcher",
      "@sentry/profiling-node",
      "@tree-sitter/*",
      "aws-sdk",
      "classic-level",
      "dd-trace",
      "ffi-napi",
      "grpc",
      "hiredis",
      "kerberos",
      "leveldown",
      "miniflare",
      "mysql2",
      "newrelic",
      "odbc",
      "piscina",
      "realm",
      "ref-napi",
      "rocksdb",
      "sass-embedded",
      "sequelize",
      "serialport",
      "snappy",
      "tinypool",
      "usb",
      "workerd",
      "wrangler",
      "zeromq",
      "zeromq-prebuilt",
      "playwright",
      "puppeteer",
      "puppeteer-core",
      "electron",
    ],
    sourcemap: "linked",
    plugins: [
      // pino relies on workers to handle logging, instead of externalizing it we use a plugin to handle it
      esbuildPluginPino({ transports: ["pino-pretty"] })
    ],
    // Make sure packages that are cjs only (e.g. express) but are bundled continue to work in our esm output file
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
    `,
    },
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
