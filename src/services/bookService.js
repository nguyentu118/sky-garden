import axios from "axios";

const API_URL = "http://localhost:3001/books";

export const getBooks = () => axios.get(API_URL);
export const createBook = (book) => axios.post(API_URL, book);
