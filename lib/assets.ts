import fs from "node:fs";
import path from "node:path";

/**
 * Returns the public URL if the file exists in /public, otherwise null.
 * Lets the site render nice fallbacks until optional images
 * (palace, events, decorations) are added.
 */
export function optionalImage(src: string): string | null {
  return fs.existsSync(path.join(process.cwd(), "public", src)) ? src : null;
}
