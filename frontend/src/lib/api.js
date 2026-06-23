import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API, timeout: 15000 });

export const api = {
  collections: () => client.get("/collections").then((r) => r.data),
  collection: (handle) => client.get(`/collections/${handle}`).then((r) => r.data),
  products: (params) => client.get("/products", { params }).then((r) => r.data),
  product: (handle) => client.get(`/products/${handle}`).then((r) => r.data),
  search: (q) => client.get("/search", { params: { q } }).then((r) => r.data),
  checkout: (payload) => client.post("/checkout", payload).then((r) => r.data),
};
