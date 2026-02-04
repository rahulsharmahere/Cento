import axios from 'axios';

export const checkServerInfo = async (serverUrl) => {
  return axios.get(`${serverUrl}/api/info`, {
    timeout: 8000,
  });
};
