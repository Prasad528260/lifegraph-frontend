import axios from "axios";

// withCredentials: true → sends cookie automatically with every request
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true, // this is the only thing needed
});

// ── AUTH ──
export const registerAPI = (data) => api.post("/auth/register", data);
export const loginAPI = (data) => api.post("/auth/login", data);
export const getMeAPI = () => api.get("/auth/me");
export const logoutAPI = () => api.post("/auth/logout");

// ── CAPSULE ──
export const getCapsuleAPI = () => api.get("/capsule/get");
export const updateCapsuleAPI = (data) => api.post("/capsule/update", data);

// ── GRAPH ──
export const getGraphAPI = () => api.get("/graph/get");

// ── INSTITUTIONS ──
export const getInstitutionsAPI = () => api.get("/institutions");
export const addInstitutionAPI = (data) => api.post("/institutions/add", data);
export const getInstitutionByIdAPI = (id) => api.get(`/institutions/${id}`);

// ── TRUST ──
export const getTrustAPI = (institutionId) => api.get(`/trust/${institutionId}`);
export const addTrustEventAPI = (data) => api.post("/trust/event", data);

// ── ACCESS ──
export const requestAccessAPI = (data) => api.post("/access/request", data);

// ── LOGS ──
export const getAllLogsAPI = () => api.get("/logs");
export const getUserLogsAPI = (userId) => api.get(`/logs/user`);
export const getInstitutionLogsAPI = (id) => api.get(`/logs/institution/${id}`);


export const registerAdminAPI = (data) => api.post("/auth/register/admin", data);
export const registerSuperAdminAPI = (data) => api.post("/auth/register/superadmin", data);

export const getStatsAPI = () => api.get("/stats");