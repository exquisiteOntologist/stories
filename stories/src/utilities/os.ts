import { platform, Platform } from "@tauri-apps/plugin-os";

type TauriPlatform = { os: { platform: () => String } };
declare var __TAURI__: TauriPlatform;
export const isMac = async () => platform() === "macos";
