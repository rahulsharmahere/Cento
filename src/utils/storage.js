import AsyncStorage from '@react-native-async-storage/async-storage';



const SERVER_KEY = 'SERVER_URL';
const API_KEY = 'API_KEY';

export const saveServerConfig = async (serverUrl, apiKey) => {
  await AsyncStorage.multiSet([
    [SERVER_KEY, serverUrl],
    [API_KEY, apiKey],
  ]);
};

export const getServerConfig = async () => {
  const values = await AsyncStorage.multiGet([SERVER_KEY, API_KEY]);
  return {
    serverUrl: values[0][1],
    apiKey: values[1][1],
  };
};

export const clearServerConfig = async () => {
  await AsyncStorage.multiRemove([SERVER_KEY, API_KEY]);
};


const BIOMETRIC_KEY = 'biometric_enabled';

export const setBiometricEnabled = async (value) => {
  await AsyncStorage.setItem(BIOMETRIC_KEY, JSON.stringify(value));
};

export const getBiometricEnabled = async () => {
  const value = await AsyncStorage.getItem(BIOMETRIC_KEY);
  return value ? JSON.parse(value) : false;
};