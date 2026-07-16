import { app } from "electron";
import path from "path";
import fs from "fs";

/**
 * Resolves the folder the database file should live in.
 * In production this MUST sit next to the executable (not in the OS user-data
 * folder) so the whole app + data stays portable on the USB drive.
 */
export function getPortableRoot(): string {
  if (!app.isPackaged) {
    return path.join(__dirname, "..", "data");
  }

  // Windows portable build: electron-builder actually unpacks and runs the app
  // from a temp folder, NOT the USB drive, so app.getPath('exe') would point to
  // the wrong place. It sets PORTABLE_EXECUTABLE_DIR to the real launch folder
  // (the USB drive) specifically to work around this.
  if (process.platform === "win32" && process.env.PORTABLE_EXECUTABLE_DIR) {
    return process.env.PORTABLE_EXECUTABLE_DIR;
  }

  // macOS dir build: exePath is inside AppName.app/Contents/MacOS, so we walk up
  // to the folder that contains the .app bundle (the USB root).
  const exeDir = path.dirname(app.getPath("exe"));
  if (process.platform === "darwin") {
    const appBundleIndex = exeDir.indexOf(".app");
    if (appBundleIndex !== -1) {
      const appBundlePath = exeDir.slice(0, appBundleIndex + 4);
      return path.dirname(appBundlePath);
    }
  }
  return exeDir;
}

export function getDatabasePath(): string {
  const root = getPortableRoot();
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }
  return path.join(root, "cash-sheet.sqlite");
}
