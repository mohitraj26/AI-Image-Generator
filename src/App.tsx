import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import HistoryPage from './pages/history';
import CommunityPage from './pages/community';

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
        <Route
          path="/history"
          element={
            isAuthenticated() ? <HistoryPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/community"
          element={
            isAuthenticated() ? <CommunityPage /> : <Navigate to="/login" />
          }
        />
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App
