import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;
const apiClient = axios.create({
  baseURL: baseURL,
});

const authToken = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY);
if (authToken) apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

function setAuthToken(token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export { setAuthToken };
export default apiClient;
