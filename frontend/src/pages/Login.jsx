import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure } from "../features/auth/authSlice";
import { loginAPI } from "../features/auth/authAPI";
import toast from "react-hot-toast";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  dispatch(loginStart());

  const loadingToast = toast.loading("Logging in...");

  try {
    const res = await loginAPI(formData);

    dispatch(
      loginSuccess({
        user: res.user,
        token: res.tokens.access,
      })
    );

    toast.dismiss(loadingToast);
    toast.success("Login successful 🎉");

    if (res.user.is_admin) {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  } catch (err) {
    dispatch(loginFailure("Login failed"));
    toast.dismiss(loadingToast);
    toast.error(
      err?.response?.data?.error || "Invalid email or password"
    );
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    className="w-full p-3 border rounded-lg pr-12"
    value={formData.password}
    onChange={handleChange}
    required
  />

  
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
