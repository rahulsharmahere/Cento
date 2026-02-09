import { Platform } from 'react-native';

const GITHUB_API =
  'https://api.github.com/repos/rahulsharmahere/cento/releases/latest';

export async function checkForUpdate(currentVersion) {
  if (Platform.OS !== 'android') return null;

  const res = await fetch(GITHUB_API);
  const json = await res.json();

  if (!json.tag_name) return null;

  const latestVersion = json.tag_name.replace('v', '');

  if (latestVersion !== currentVersion) {
    return {
      latestVersion,
      releaseUrl: json.html_url, // GitHub release page
    };
  }

  return null;
}
