import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Main Container */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        
        {/* Welcome Text */}
        <h2 className="text-3xl font-bold mb-6 text-center">
          Welcome, {user?.username}
        </h2>

        {/* Profile Image */}
        <div className="mb-8">
          {user?.profile_image ? (
            <img
              src={`http://127.0.0.1:8000${user.profile_image}`}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-700 shadow-lg">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h3 className="text-xl font-semibold mb-4">
            User Information
          </h3>

          <p className="text-lg mb-2">
            <strong>Email:</strong> {user?.email}
          </p>

          <p className="text-lg mb-2">
            <strong>Username:</strong>{" "}
            {user?.username ? user.username : "User"}
          </p>

          <p className="text-lg">
            <strong>Role:</strong>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                user?.is_admin
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {user?.is_admin ? "Admin" : "User"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
