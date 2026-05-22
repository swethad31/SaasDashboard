import axios from "axios";

const api = axios.create({
	baseURL: "/api", // Proxy to backend, or set full URL if needed
});

// Optionally add token to headers for authenticated requests
export function setAuthToken(token) {
	if (token) {
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		delete api.defaults.headers.common["Authorization"];
	}
}

export default api;
