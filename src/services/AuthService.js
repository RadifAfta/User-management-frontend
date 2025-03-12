import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// Konfigurasi default axios
axios.defaults.withCredentials = true; // Pastikan cookie dikirim
axios.defaults.timeout = 10000; // Timeout 10 detik

// Interceptor untuk menangani error secara global
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

const getCsrfToken = async () => {
  try {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`);
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
    throw new Error("Gagal mendapatkan token keamanan. Coba muat ulang halaman.");
  }
};

const login = async (email, password) => {
  try {
    // Mendapatkan token CSRF sebelum login
    await getCsrfToken();

    // Kirim permintaan login
    const response = await axios.post(`${API_URL}/api/login`, { email, password });

    if (response.data.token) {
      // Simpan token dan informasi user
      localStorage.setItem("user", JSON.stringify(response.data));
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    } else if (response.data.status === "success" && !response.data.token) {
      // Jika sukses tapi tidak ada token (mungkin skenario cookie-based Sanctum)
      const user = { ...response.data, isAuthenticated: true };
      localStorage.setItem("user", JSON.stringify(user));
    }

    return response.data;
  } catch (error) {
    // Log error untuk debugging
    console.error("Login error details:", error);
    
    // Lanjutkan error ke komponen untuk ditangani di sana
    throw error;
  }
};

const register = async (name, email, password) => {
  try {
    // Mendapatkan token CSRF sebelum registrasi
    await getCsrfToken();
    
    // Kirim permintaan registrasi
    return await axios.post(`${API_URL}/api/register`, { name, email, password });
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    // Jika menggunakan token-based auth
    const user = getCurrentUser();
    if (user && user.token) {
      await axios.post(`${API_URL}/api/logout`);
    } else {
      // Jika menggunakan cookie-based auth (Sanctum default)
      await axios.post(`${API_URL}/api/logout`);
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Hapus data lokal terlepas dari hasil API call
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  }
};

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

const isAuthenticated = () => {
  const user = getCurrentUser();
  return (
    !!user && 
    (!!user.token || !!user.isAuthenticated) && 
    !isTokenExpired(user)
  );
};

// Helper untuk memeriksa apakah token sudah kadaluarsa (jika ada expiry timestamp)
const isTokenExpired = (user) => {
  if (user && user.expires_at) {
    const expiryTime = new Date(user.expires_at).getTime();
    const currentTime = new Date().getTime();
    return currentTime > expiryTime;
  }
  return false;
};

// Fungsi untuk refresh token (jika backend mendukung)
const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/refresh-token`);
    if (response.data.token) {
      const user = getCurrentUser();
      const updatedUser = { ...user, token: response.data.token };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    console.error("Token refresh failed:", error);
    // Logout jika refresh token gagal
    await logout();
    throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
  }
};

export { 
  login, 
  register, 
  logout, 
  getCurrentUser, 
  isAuthenticated,
  refreshToken
};