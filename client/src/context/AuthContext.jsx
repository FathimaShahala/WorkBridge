
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // Restore Authentication
  // =========================
  useEffect(() => {
    const restoreSession = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);

        if (!parsedUser || !parsedUser.role) {
          throw new Error("Invalid stored user data");
        }

        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error(
          "Failed to restore user session:",
          error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // =========================
  // Login
  // =========================
  const loginUser = (data) => {
    if (!data?.token || !data?.user) {
      console.error("Invalid login response.");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    setToken(data.token);
    setUser(data.user);
  };

  // =========================
  // Logout
  // =========================
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // =========================
  // Authentication Status
  // =========================
  const isAuthenticated = Boolean(
    user && token
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =========================
// useAuth Hook
// =========================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
