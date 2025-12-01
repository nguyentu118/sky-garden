import axios from "axios";

const API_URL = "http://localhost:3001/categories";

export const getCategories = () => axios.get(API_URL);
