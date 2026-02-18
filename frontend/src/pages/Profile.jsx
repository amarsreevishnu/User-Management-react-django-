import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getProfileAPI, updateProfileAPI } from "../features/users/userAPI";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const data = await getProfileAPI();
      setProfile(data);
      setUsername(data.username);
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("username", username);

    if (image) {
      formData.append("profile_image", image);
    }

    // Only send password if user typed something
    if (password.trim() !== "") {
      formData.append("password", password);
    }

    try {
      const res = await updateProfileAPI(formData);
      setProfile(res.user);

      // Sync updated user to localStorage (important for navbar image update)
      localStorage.setItem("user", JSON.stringify(res.user));

      alert("Profile updated successfully!");
      setPassword("");
      setPreview(null);
    } catch (error) {
      console.error("Update error", error);
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-lg font-semibold">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex justify-center items-center px-6 py-12">
        <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl w-full max-w-md">
          
          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 text-center">
            My Profile
          </h2>

          {/* Profile Image with Preview */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={
                preview
                  ? preview
                  : profile.profile_image
                  ? `http://127.0.0.1:8000${profile.profile_image}`
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-5">
            
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>

            {/* Image Upload */}
            <div className="w-full">
  <label className="block text-sm font-semibold mb-2">
    Profile Image
  </label>

  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
    <span className="text-gray-600 font-medium">
      Click to upload profile image
    </span>
    <span className="text-xs text-gray-400 mt-1">
      PNG, JPG, JPEG
    </span>

    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
          setPreview(URL.createObjectURL(file));
        }
      }}
      className="hidden"
    />
  </label>
</div>


            

            {/* Update Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
