import api from "./axios";

const normalizeRoleValue = (role: any): string => {
  if (typeof role === "string") {
    return role;
  }

  if (role?.value) {
    return String(role.value);
  }

  if (role?.role) {
    return String(role.role);
  }

  if (role?.name) {
    return String(role.name);
  }

  return String(role);
};

export const parseRoleList = (payload: any): string[] => {
  const data = payload?.data ?? payload;

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => normalizeRoleValue(item))
    .filter((item) => typeof item === "string" && item.trim().length > 0);
};

export const getRoles = async (): Promise<string[]> => {
  const response = await api.get("/users/roles");
  return parseRoleList(response.data);
};
