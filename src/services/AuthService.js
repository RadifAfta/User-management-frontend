import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

// Konfigurasi default axios
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && isAuthenticated()) {
      logout();
      window.location.href = "/login";
    }
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
      // Tambahkan pengecekan untuk mendapatkan role dari response
      // (pastikan backend mengirimkan data role)
      const role = response.data.user?.role || 'user'; // Default ke 'user' jika tidak ada
      
      const userData = {
        token: response.data.token,
        user: {
          ...response.data.user,
          role: role // Tambahkan role ke dalam objek user
        },
        role: role, // Simpan juga di level atas untuk kompatibilitas
        isAuthenticated: true
      };
      
      // Log data untuk debugging
      console.log("Saving user data with role:", userData);
      
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
    await getCsrfToken();
    
    const response = await axios.post(`${API_URL}/api/register`, { 
      name, 
      email, 
      password,
      password_confirmation: password
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

// PERBAIKAN: Fungsi isAdmin yang menyesuaikan dengan struktur data dari backend
const isAdmin = () => {
  const userData = getCurrentUser();
  
  // Periksa apakah user.user memiliki properti role
  if (userData?.user?.role === 'admin') {
    return true;
  }
  
  // Periksa apakah user memiliki properti role
  if (userData?.role === 'admin') {
    return true;
  }
  
  // Jika tidak ada role atau bukan admin, kembalikan false
  return false;
};

// Fungsi untuk debug - tambahkan ke export jika diperlukan
const checkUserRole = () => {
  const userData = getCurrentUser();
  console.log("Full user data:", userData);
  console.log("User role path 1:", userData?.role);
  console.log("User role path 2:", userData?.user?.role);
  
  return {
    hasRole: !!userData?.role || !!userData?.user?.role,
    roleValue: userData?.role || userData?.user?.role || 'tidak ada'
  };
};

const isTokenExpired = (user) => {
  if (user && user.expires_at) {
    const expiryTime = new Date(user.expires_at).getTime();
    const currentTime = new Date().getTime();
    return currentTime > expiryTime;
  }
  return false;
};

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
  isAdmin,
  checkUserRole, // Tambahkan fungsi debug
  refreshToken
};