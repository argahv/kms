import { Role } from "@prisma/client";

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
  status: "present" | "absent" | "late";
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
