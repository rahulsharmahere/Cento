import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

const MATOMO_URL = 'https://analytics.9rs.us/index.php';
const SITE_ID = '1';

let visitorId;

const getVisitorId = async () => {
  if (!visitorId) {
    visitorId = await DeviceInfo.getUniqueId();
  }
  return visitorId;
};

export const trackEvent = async (category, action, name = '') => {
  try {
    const id = await getVisitorId();

    const body = new URLSearchParams({
      idsite: SITE_ID,
      rec: '1',
      apiv: '1',
      rand: Date.now().toString(),
      _id: id,
      e_c: category,
      e_a: action,
      e_n: name,
      ua: `Cento/${DeviceInfo.getVersion()} (${Platform.OS})`,
    }).toString();

    fetch(MATOMO_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
  } catch {
    // analytics should never break app
  }
};
