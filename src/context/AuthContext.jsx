import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import API from "../api/axiosInstance"; // Axios instance ko import karein

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1. Initial State ko localStorage se load karna (Optimized Lazy Initialization)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("LocalStorage parsing error:", error);
      return null;
    }
  });

  // 2. Cross-Tab Sync (Jab ek tab me logout ho toh baki tabs me bhi update ho jaye)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user" || e.key === "token") {
        if (!e.newValue) {
          setUser(null); // Clear local state agar storage empty ho chuki hai
        } else if (e.key === "user") {
          setUser(JSON.parse(e.newValue));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 4. Logout Handler (UseCallback ka use kiya gaya hai taaki timer effect me properly reference ho sake)
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  // --- NEW: Inactivity Timeout Logic (15 Minutes) ---
  useEffect(() => {
    // Agar user logged in nahi hai, toh timer chalane ki zaroorat nahi hai
    if (!user) return;

    let inactivityTimer;

    const handleUserActivity = () => {
      // Agar purana timer chal raha hai, toh use clear karke reset kar do
      if (inactivityTimer) clearTimeout(inactivityTimer);

      // 15 minutes = 15 * 60 * 1000 ms = 900,000 ms (Aap testing ke liye ise kam bhi kar sakte hain)
      inactivityTimer = setTimeout(
        () => {
          logout();
          alert(
            "Session expired due to 15 minutes of inactivity. Please login again.",
          );
        },
        15 * 60 * 1000,
      );
    };

    // User ki activities jo track ki jayengi
    const activityEvents = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "keypress",
    ];

    // Events listeners attach karein
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Pehli baar component load hone par timer start karein
    handleUserActivity();

    // Cleanup function: Jab component unmount ho ya user logout ho jaye toh listeners hata dein
    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [user, logout]);
  // --------------------------------------------------

  // 3. Updated Login Handler: Ab ye Direct API Request send karega (Email & Password accept karke)
  const login = async (email, password) => {
    try {
      // Backend POST request to /users/login
      const response = await API.post("/auth/login", { email, password });
      const userData = response.data;

      // State aur LocalStorage update karein
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      if (userData.token) {
        localStorage.setItem("token", userData.token);
      }

      return { success: true, data: userData };
    } catch (error) {
      // API error response ko component tak pass karein
      return {
        success: false,
        message: error.response?.data?.message || "Login Failed! Server Error.",
      };
    }
  };

  // Helper flags
  const isStudent = user?.role === "student";
  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token || localStorage.getItem("token"),
        login,
        logout,
        isStudent,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook export
export function useAuthContext() {
  return useContext(AuthContext);
}
