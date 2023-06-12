
type TauriPlatform = { os: { platform: () => String }}
declare var __TAURI__: TauriPlatform
export const isMac = async () => await (__TAURI__ as TauriPlatform).os.platform() === 'Darwin'
