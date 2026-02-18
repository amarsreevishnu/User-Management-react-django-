import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerAPI } from "../features/auth/authAPI";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    is_admin: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const loadingToast = toast.loading("Creating account...");

  try {
    await registerAPI(formData);
    toast.dismiss(loadingToast);
    toast.success("Registration successful! Please login 🎉");
    navigate("/");
  } catch (err) {
    toast.dismiss(loadingToast);
    toast.error("Registration failed");
    console.error(err.response?.data);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-3 border rounded-lg"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={formData.email}
            onChange={handleChange}
            required
          />
        
          <input
            type={showPassword? "test":"password"}
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            value={formData.password}
            onChange={handleChange}
            required
            
          />  
        
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            
          >
            {showPassword ? "Hide password" : "Show password"}
          </button>
          

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_admin"
              checked={formData.is_admin}
              onChange={handleChange}
            />
            Register as Admin
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
