import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle token refresh on 401 errors
axiosClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Only try to refresh once to avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get stored tokens
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!token || !refreshToken) {
          throw new Error('No tokens found');
        }

        // Try to get new tokens
        const response = await axios.get('https://localhost:5001/api/account/getrefreshtoken', {
          params: { accessToken: token, refreshToken }
        });

        // Update tokens
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update headers and retry request
        axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);

      } catch (refreshError) {
        // Clear everything and redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;