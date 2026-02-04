import { Platform } from 'react-native';

const GITHUB_API =
  'https://api.github.com/repos/<YOUR_USERNAME>/<YOUR_REPO>/releases/latest';

export async function checkForUpdate(currentVersion) {
  if (Platform.OS !== 'android') return null;

  const res = await fetch(GITHUB_API);
  const json = await res.json();

  if (!json.tag_name) return null;

  const latestVersion = json.tag_name.replace('v', '');

  if (latestVersion !== currentVersion) {
    const apkAsset = json.assets.find(a =>
      a.name.endsWith('.apk')
    );

    if (!apkAsset) return null;

    return {
      latestVersion,
      downloadUrl: apkAsset.browser_download_url,
    };
  }

  return null;
}
