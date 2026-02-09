import RNFS from "react-native-fs";
import { Platform, Linking } from "react-native";
import FileViewer from "react-native-file-viewer";

let currentJobId = null;

export async function downloadAndInstallApk(apkUrl, version = "latest", onProgress) {
  if (!apkUrl) throw new Error("downloadAndInstallApk: apkUrl missing");

  const safeVersion = String(version).replace(/[^0-9.]/g, "") || "latest";
  const fileName = `finfly-v${safeVersion}.apk`;
  // use Download dir for Android, Document dir for iOS
  const downloadPath =
    Platform.OS === "android"
      ? `${RNFS.DownloadDirectoryPath}/${fileName}`
      : `${RNFS.DocumentDirectoryPath}/${fileName}`;

  console.log("⬇️ Starting download to:", downloadPath);

  try {
    const exists = await RNFS.exists(downloadPath);
    if (exists) {
      await RNFS.unlink(downloadPath);
      console.log("🗑️ Deleted existing APK:", downloadPath);
    }
  } catch (e) {
    console.warn("Cleanup error:", e.message);
  }

  const dl = RNFS.downloadFile({
    fromUrl: apkUrl,
    toFile: downloadPath,
    background: true,
    progressDivider: 1,
    progress: (res) => {
      if (onProgress && res.contentLength > 0) {
        const percent = (res.bytesWritten / res.contentLength) * 100;
        console.log("📊 Download progress:", percent.toFixed(1) + "%");
        onProgress(percent);
      }
    },
  });

  currentJobId = dl.jobId;

  let result;
  try {
    result = await dl.promise;
  } catch (err) {
    // 🚑 JS-side fix for RNFS bug (null code crashes)
    const safeError = {
      code: err?.code || "ECANCELED",
      message: err?.message || err?.description || "Download canceled",
    };
    console.log("🚫 Download failed:", safeError);
    currentJobId = null;
    throw safeError;
  }

  currentJobId = null;

  if (result.statusCode === 200) {
    console.log("✅ Download finished:", downloadPath);

    try {
      await FileViewer.open(downloadPath, { showOpenWithDialog: true });
      console.log("📦 Installer launched via FileViewer");
    } catch (err) {
      console.warn("⚠️ FileViewer failed:", err.message);
      const fallbackUrl = `file://${downloadPath}`;
      try {
        await Linking.openURL(fallbackUrl);
        console.log("📦 Installer launched via fallback Linking.openURL");
      } catch (err2) {
        console.error("❌ Fallback openURL also failed:", err2.message);
        throw err2;
      }
    }

    return downloadPath;
  } else {
    throw { code: "EHTTP", message: "Download failed with status " + result.statusCode };
  }
}

export function cancelDownload() {
  if (currentJobId) {
    try {
      RNFS.stopDownload(currentJobId);
      console.log("❌ Download canceled, jobId:", currentJobId);
    } catch (e) {
      console.warn("Cancel failed:", e.message);
    } finally {
      currentJobId = null;
    }
  } else {
    console.warn("No current download to cancel");
  }
}

export default downloadAndInstallApk;
