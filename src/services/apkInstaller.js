import { Platform, Linking } from 'react-native';
import RNFS from 'react-native-fs';

const APK_PATH = `${RNFS.DownloadDirectoryPath}/cento_update.apk`;

export async function downloadAndInstallApk(
  url,
  onProgress,
  onCancelRef
) {
  if (Platform.OS !== 'android') return;

  // 🧹 Delete old APK if exists
  if (await RNFS.exists(APK_PATH)) {
    await RNFS.unlink(APK_PATH);
  }

  const download = RNFS.downloadFile({
    fromUrl: url,
    toFile: APK_PATH,
    progress: res => {
      const percent =
        (res.bytesWritten / res.contentLength) * 100;
      onProgress(Math.floor(percent));
    },
    progressDivider: 1,
  });

  // ❌ Allow cancel
  onCancelRef.current = () => download.stop();

  const result = await download.promise;

  if (result.statusCode === 200) {
    // 🔥 Trigger Android installer
    await Linking.openURL(`file://${APK_PATH}`);
  } else {
    throw new Error('Download failed');
  }
}
