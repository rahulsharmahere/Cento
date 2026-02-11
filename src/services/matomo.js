import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

const MATOMO_URL = 'https://analytics.9rs.us/matomo.php';
const SITE_ID = '1';

const VISITOR_KEY = 'matomo_visitor_id';

const generateVisitorId = () => {
  return 'xxxxxxxxyxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getVisitorId = async () => {
  let id = await AsyncStorage.getItem(VISITOR_KEY);

  if (!id) {
    id = generateVisitorId();
    await AsyncStorage.setItem(VISITOR_KEY, id);
  }

  return id;
};

export const trackEvent = async (category, action, name = '') => {
  try {
    const visitorId = await getVisitorId();

    const androidVersion = DeviceInfo.getSystemVersion();
    const deviceModel = DeviceInfo.getModel();
    const apiLevel = await DeviceInfo.getApiLevel();

    const body = new URLSearchParams({
      idsite: SITE_ID,
      rec: '1',
      apiv: '1',
      rand: Date.now().toString(),

      _id: visitorId,
      action_name: `${category}:${action}`,

      e_c: category,
      e_a: action,
      e_n: name,

      ua: `Cento/${DeviceInfo.getVersion()} (${Platform.OS})`,

      // 🔥 Custom Dimensions (configure in Matomo)
      dimension1: androidVersion,          // Android Version
      dimension2: deviceModel,             // Device Model
      dimension3: apiLevel.toString(),     // API Level
    }).toString();

    fetch(MATOMO_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    }).catch(() => {});
  } catch {}
};
