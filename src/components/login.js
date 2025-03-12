import React, { useState, useEffect } from "react";
import { login } from "../services/AuthService";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Efek untuk menghilangkan pesan error setelah beberapa detik
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000); // Hilangkan pesan error setelah 5 detik
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Tambahkan timeout yang lebih lama untuk menunggu respons dari server Laravel
      const result = await Promise.race([
        login(email, password),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout: Server tidak merespons")), 15000)
        )
      ]);
      
      console.log("Login successful:", result);
      
      // Jika login berhasil
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      
      // Tampilkan pesan error di konsol untuk debugging
      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
      }
      
      // Penanganan error yang lebih spesifik dan detail
      if (error.response) {
        // Respons dari server diterima tapi dengan status error
        const status = error.response.status;
        const data = error.response.data;
        
        // Tampilkan pesan error berdasarkan format respons dari API Laravel
        if (data.message) {
          setError(data.message);
        } else if (data.error) {
          setError(data.error);
        } else if (data.errors) {
          // Tangani format validasi error Laravel
          if (typeof data.errors === 'object') {
            const firstErrorField = Object.keys(data.errors)[0];
            if (firstErrorField && data.errors[firstErrorField][0]) {
              setError(data.errors[firstErrorField][0]);
            } else {
              setError("Validasi gagal. Periksa kembali data Anda.");
            }
          } else {
            setError(data.errors);
          }
        } else {
          // Fallback pesan error berdasarkan status
          if (status === 404) {
            setError("Email tidak terdaftar. Silakan cek kembali atau daftar akun baruxxxxxx.");
          } else if (status === 401) {
            setError("Email atau password salah. Silakan coba lagi.");
          } else if (status === 429) {
            setError("Terlalu banyak percobaan login. Silakan coba lagi nanti.");
          } else if (status >= 500) {
            setError("Terjadi masalah pada server. Silakan coba lagi nanti.");
          } else {
            setError("Login gagal. Silakan periksa kembali kredensial Anda.");
          }
        }
      } else if (error.request) {
        // Request dikirim tapi tidak ada respons dari server
        setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      } else if (error.message && error.message.includes("Timeout")) {
        setError("Server membutuhkan waktu terlalu lama untuk merespons. Coba lagi nanti.");
      } else {
        // Error lainnya
        setError(error.message || "Terjadi kesalahan saat proses login. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded animate-fade-in">
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FiLogIn className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
              </span>
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;