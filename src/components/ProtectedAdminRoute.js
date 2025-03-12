// Protected Route khusus untuk admin
const ProtectedAdminRoute = ({ children }) => {
    // Untuk debugging, tampilkan info user saat mencoba akses
    const user = getCurrentUser();
    console.log("Admin route check - User data:", user);
    console.log("Admin route check - isAdmin():", isAdmin());
    
    // Cek apakah user terautentikasi
    if (!isAuthenticated()) {
      console.log("User not authenticated, redirecting to login");
      return <Navigate to="/login" />;
    }
    
    // Cek apakah user memiliki role admin
    if (!isAdmin()) {
      console.log("User not admin, redirecting to profile");
      return <Navigate to="/profile" />;
    }
    
    console.log("User is admin, allowing access");
    return children;
  };