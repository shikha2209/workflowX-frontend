import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/ai",
});

API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export interface GeneratedTask {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  estimatedHours: number;
  subtasks: string[];
}

export const generateTaskWithAI =
  async (
    taskIdea: string
  ): Promise<GeneratedTask> => {

    const response =
      await API.post(
        "/generate-task",
        {
          taskIdea,
        }
      );

    return response.data;
  };