import { AttendanceStatus, Role } from "@prisma/client";

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: {
    name: string;
  };
}

export interface User {
  id: string;
  name: string;
  role: Role;
  children?: Child[];
}

export interface Child {
  id: string;
  name: string;
}

export interface RoutineEntry {
  id: string;
  day: string;
  time: string;
  subject: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
}

export interface Mark {
  id: string;
  subject: string;
  score: number;
  totalScore: number;
}

export interface LearningMaterial {
  id: string;
  title: string;
  subject: string;
  type: "pdf" | "video";
  url: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ErrorResponse {
  message: string;
}
