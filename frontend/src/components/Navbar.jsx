import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/home")}
      >
        User Management 
      </h1>

      <div className="flex items-center gap-4">
        <span className="font-medium">
          {user?.username} ({user?.is_admin ? "Admin" : "User"})
        </span>

        <button
          onClick={() => navigate("/profile")}
          className="bg-white text-blue-600 px-3 py-1 rounded"
        >
          Profile
        </button>

        {user?.is_admin && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-yellow-400 text-black px-3 py-1 rounded"
          >
            Admin Panel
          </button>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
