import { Router } from "express";
import glob from "fast-glob";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.join(__dirname, "..");

// see: https://dev.to/dhinesh03/organizing-express-routes-with-a-route-loader-l73
// Modified in order to make it work with TypeScript (magical ???? -> need to dig how it works)
export default async function RouteLoader(
  globPattern: string = "src/routes/*.ts",
): Promise<Router> {
  let router = Router();
  let files: string[] = [];
  try {
    files = await glob(globPattern, { cwd: BASE_DIR });
    console.log(`📁 [ROUTE LOADER] Found route files:`, files);
  } catch (error) {
    console.error(error);
  }

  for (const file of files) {
    // Exclure le fichier index.ts
    if (file.includes('index.ts')) {
      console.log(`⏭️ [ROUTE LOADER] Skipping index.ts file: ${file}`);
      continue;
    }
    
    if (
      fs.statSync(file).isFile() &&
      path.extname(file).toLowerCase() === ".ts"
    ) {
      try {
        console.log(`🔄 [ROUTE LOADER] Loading route file: ${file}`);
        const routeModule = await import(path.resolve(file));
        router = (routeModule.default || routeModule)(router);
        console.log(`✅ [ROUTE LOADER] Successfully loaded: ${file}`);
      } catch (e: any) {
        console.error(`❌ [ROUTE LOADER] Error loading route file: ${file}`, e);
        throw new Error(
          `Error when loading route file: ${file} [ ${e.toString()} ]`,
        );
      }
    }
  }

  console.log(`🎯 [ROUTE LOADER] Route loading completed`);
  return router;
}
