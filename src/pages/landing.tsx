import { Link } from "react-router-dom";

const landing = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">AI Image Generator</h1>
      <p className="mb-8">Create AI images from your imagination</p>
      <div className="flex gap-4">
        <Link to="/login">
          <button className="px-4 py-2 bg-blue-500 rounded">Login</button>
        </Link>
        <Link to="/signup">
          <button className="px-4 py-2 bg-green-500 rounded">Signup</button>
        </Link>
      </div>
    </div>
  );
};

export default landing;
