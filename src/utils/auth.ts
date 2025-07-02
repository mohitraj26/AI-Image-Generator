type User = {
  username: string;
  password: string;
};

// Save user credentials (during signup)
export const signup = (username: string, password: string): void => {
  const user: User = { username, password };
  localStorage.setItem("user", JSON.stringify(user));
};

// Validate credentials (during login)
export const login = (username: string, password: string): boolean => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser: User = JSON.parse(storedUser);
    if (parsedUser.username === username && parsedUser.password === password) {
      localStorage.setItem("isAuth", "true");
      return true;
    }
  }
  return false;
};

// Check if user is logged in
export const isAuthenticated = (): boolean => {
  return localStorage.getItem("isAuth") === "true";
};

// Log user out
export const logout = (): void => {
  localStorage.removeItem("isAuth");
};
