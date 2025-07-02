import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../utils/auth";

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSignup = () => {
    signup(username, password);
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-800 text-white">
      <h2 className="text-2xl mb-4">Signup</h2>
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
      <button onClick={handleSignup} className="px-4 py-2 bg-green-500 rounded">
        Signup
      </button>
    </div>
  );
};

export default Signup;
