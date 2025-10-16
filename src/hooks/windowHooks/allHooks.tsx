import { useConfigHook } from "./configHook";
import { useDesktopConfigHook } from "./desktopConfig";
import { useFileHook } from "./fileHook";
import { useImageViewerHook } from "./imageViewerHook";
import { useListDesktopHook } from "./listDesktopHook";
import { useNewDesktopHook } from "./newDesktopHook";
import { useNewFileHook } from "./newFileHook";
import { useOpenLinkHook } from "./openLinkHook";
import { useProfileHook } from "./profileHook";

export function useAllWindows() {
    return {
        fileViewer: useFileHook(),
        listdt: useListDesktopHook(),
        profile: useProfileHook(),
        config: useConfigHook(),
        newFile: useNewFileHook(),
        newdt: useNewDesktopHook(),
        openLink: useOpenLinkHook(),
        dtConfig: useDesktopConfigHook(),
        imgViewer: useImageViewerHook(),
    };
}