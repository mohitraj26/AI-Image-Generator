import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import { isAuthenticated } from "./utils/auth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App
