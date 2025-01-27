import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Child,
  RoutineEntry,
  AttendanceRecord,
  Mark,
  LearningMaterial,
  LoginResponse,
} from "@/types";

const api = axios.create({
  baseURL: "/api",
});

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    },
  });
};
export const useSignup = () => {
  return useMutation({
    mutationFn: async (credentials: {
      name: string;
      email: string;
      password: string;
      role: string;
    }) => {
      const response = await api.post<LoginResponse>(
        "/auth/signup",
        credentials
      );
      return response.data;
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<User[]>("/users");
      return response.data;
    },
  });
};

export const useChildren = () => {
  return useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const response = await api.get<Child[]>("/children");
      return response.data;
    },
  });
};

export const useRoutine = () => {
  return useQuery({
    queryKey: ["routine"],
    queryFn: async () => {
      const response = await api.get<RoutineEntry[]>("/routine");
      return response.data;
    },
  });
};

export const useAttendanceRecords = () => {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const response = await api.get<AttendanceRecord[]>("/attendance");
      return response.data;
    },
  });
};

export const useMarks = () => {
  return useQuery({
    queryKey: ["marks"],
    queryFn: async () => {
      const response = await api.get<Mark[]>("/marks");
      return response.data;
    },
  });
};

export const useLearningMaterials = () => {
  return useQuery({
    queryKey: ["learning-materials"],
    queryFn: async () => {
      const response = await api.get<LearningMaterial[]>("/learning-materials");
      return response.data;
    },
  });
};

export const useCreateRoutineEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: Omit<RoutineEntry, "id">) => {
      const response = await api.post<RoutineEntry>("/routine", entry);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routine"] });
    },
  });
};

export const useUpdateRoutineEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: RoutineEntry) => {
      const response = await api.put<RoutineEntry>(
        `/routine/${entry.id}`,
        entry
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routine"] });
    },
  });
};

export const useDeleteRoutineEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/routine/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routine"] });
    },
  });
};

export const useCreateLearningMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (material: Omit<LearningMaterial, "id">) => {
      const response = await api.post<LearningMaterial>(
        "/learning-materials",
        material
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-materials"] });
    },
  });
};

export const useUpdateLearningMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (material: LearningMaterial) => {
      const response = await api.put<LearningMaterial>(
        `/learning-materials/${material.id}`,
        material
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-materials"] });
    },
  });
};

export const useDeleteLearningMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/learning-materials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-materials"] });
    },
  });
};

export const useLinkParentChild = () => {
  return useMutation({
    mutationFn: async ({
      parentId,
      childId,
    }: {
      parentId: string;
      childId: string;
    }) => {
      const response = await api.post("/users/link-parent-child", {
        parentId,
        childId,
      });
      return response.data;
    },
  });
};
