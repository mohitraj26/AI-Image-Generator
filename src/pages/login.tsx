import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/auth";


const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (login(username, password)) {
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-800 text-white">
      <h2 className="text-2xl mb-4">Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="mb-2 p-2 rounded text-black"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="mb-4 p-2 rounded text-black"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 rounded">
        Login
      </button>
    </div>
  );
};

export default Login;
