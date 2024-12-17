import { create } from "apisauce";

const baseURL = process.env.REACT_APP_BASE_URL_RADC;
const apiClient = create({
  baseURL: baseURL,
});
const authToken = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY_RADC);
if (authToken) apiClient.setHeader("authorization", `Bearer ${authToken}`);

function setAuthToken(token) {
  apiClient.setHeader("authorization", `Bearer ${token}`);
}

export { setAuthToken };
export default apiClient;
