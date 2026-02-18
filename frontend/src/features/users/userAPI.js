import axiosInstance from "../../services/axiosInstance";

export const getProfileAPI = async () => {
  const res = await axiosInstance.get("profile/");
  return res.data;
};

export const updateProfileAPI = async (formData) => {
  const res = await axiosInstance.put("profile/update/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};


// ADMIN APIs
export const getAllUsersAPI = async (search = "") => {
  const res = await axiosInstance.get(`admin/users/?search=${search}`);
  return res.data;
};

export const createUserAPI = async (data) => {
  const res = await axiosInstance.post("admin/users/create/", data);
  return res.data;
};

export const deleteUserAPI = async (userId) => {
  const res = await axiosInstance.delete(`admin/users/${userId}/delete/`);
  return res.data;
};

export const updateUserAPI = async (userId, data) => {
  const res = await axiosInstance.put(
    `admin/users/${userId}/update/`,
    data
  );
  return res.data;
};
