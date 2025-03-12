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

    // Pastikan respons berhasil
    if (response.data.status === "success" || response.data.token) {
      const userData = {
        token: response.data.token,
        user: response.data.user || {},
        isAuthenticated: true
      };
      
      // Simpan data user
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Set header authorization untuk request berikutnya
      if (userData.token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
      }
    }

    return response.data;
  } catch (error) {
    // Pastikan error memiliki informasi lengkap untuk ditampilkan ke pengguna
    console.error("Login error details:", error);
    
    // Biarkan error asli untuk ditangani di komponen
    throw error;
  }
};

const register = async (name, email, password) => {
  try {
    // Mendapatkan token CSRF sebelum registrasi
    await getCsrfToken();
    
    // Kirim permintaan registrasi
    const response = await axios.post(`${API_URL}/api/register`, { 
      name, 
      email, 
      password,
      password_confirmation: password // Laravel sering memerlukan ini
    });

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    await axios.post(`${API_URL}/api/logout`);
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