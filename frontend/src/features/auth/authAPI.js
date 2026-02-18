import axiosInstance from "../../services/axiosInstance";

export const loginAPI = async (data) => {
  const response = await axiosInstance.post("login/", data);
  return response.data;
};

export const registerAPI = async (data) => {
  const response = await axiosInstance.post("register/", data);
  return response.data;
};
