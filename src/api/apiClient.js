import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL_RADC;
const apiClient = axios.create({
  baseURL: baseURL,
});

const authToken = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY_RADC);
if (authToken) apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

function setAuthToken(token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export { setAuthToken };
export default apiClient;
