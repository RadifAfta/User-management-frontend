import axios from "axios";
import { getCurrentUser } from "./AuthService";

const API_URL = "http://127.0.0.1:8000/api/users";

// Set up request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    const user = getCurrentUser();
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getUsers = () => axios.get(API_URL);
const getUserById = (id) => axios.get(`${API_URL}/${id}`);
const createUser = (user) => axios.post(API_URL, user);
const updateUser = (id, user) => axios.put(`${API_URL}/${id}`, user);
const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);

export { getUsers, getUserById, createUser, updateUser, deleteUser };