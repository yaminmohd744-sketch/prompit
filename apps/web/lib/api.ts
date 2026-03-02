import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const token = getToken();
    const { data } = await axios.get(`${API_BASE}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return data;
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    const token = getToken();
    const { data } = await axios.post(`${API_BASE}${path}`, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return data;
  },

  async put<T>(path: string, body: unknown): Promise<T> {
    const token = getToken();
    const { data } = await axios.put(`${API_BASE}${path}`, body, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return data;
  },

  async delete<T>(path: string): Promise<T> {
    const token = getToken();
    const { data } = await axios.delete(`${API_BASE}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return data;
  },
};

function getToken(): string | null {
  try {
    const stored = localStorage.getItem("prompit-auth");
    if (!stored) return null;
    return JSON.parse(stored)?.state?.accessToken ?? null;
  } catch {
    return null;
  }
}
