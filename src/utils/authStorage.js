import * as Keychain from 'react-native-keychain';

export const saveToken = async (token) => {
  await Keychain.setGenericPassword('auth', token);
};

export const getToken = async () => {
  const creds = await Keychain.getGenericPassword();
  return creds ? creds.password : null;
};

export const clearToken = async () => {
  await Keychain.resetGenericPassword();
};
