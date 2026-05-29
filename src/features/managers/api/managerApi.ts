import api from "../../../api/axios";
import type {
  CreateManagerPayload,
  Manager,
} from "../types/manager.types";

export type ListManagersResult = {
  users: Manager[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export const listManagers =
  async (page = 1, limit = 10): Promise<ListManagersResult> => {
    const response = await api.get(`/users?page=${page}&limit=${limit}`);

    const payload = response.data as any;

    if (Array.isArray(payload)) {
      return { users: payload, total: payload.length, page, limit, totalPages: 1 };
    }

    const users = payload?.data?.users ?? [];
    const total = payload?.data?.total ?? users.length;
    const serverPage = payload?.data?.page;
    const respPage = typeof serverPage === "number" && serverPage > 0 ? serverPage : page;
    const respLimit = limit; // always honor the requested page size
    const expectedTotalPages = respLimit > 0 ? Math.max(1, Math.ceil(total / respLimit)) : 1;
    const totalPages = Math.max(payload?.data?.totalPages ?? 0, expectedTotalPages);

    // If the server returned a page value that doesn't match the requested page, trust the requested page
    const effectivePage = serverPage === page || serverPage === undefined ? respPage : page;
    const pagedUsers = users.length > respLimit
      ? users.slice((effectivePage - 1) * respLimit, effectivePage * respLimit)
      : users;

    return {
      users: pagedUsers,
      total,
      page: effectivePage,
      limit: respLimit,
      totalPages,
    };
  };

export const getManager = async (
  id: string
): Promise<Manager> => {
  try {
    const response = await api.get(`/users/${id}`);
    const payload = response.data as any;

    if (payload?.data?.user) {
      return payload.data.user;
    }

    if (payload?.data) {
      return payload.data;
    }

    return payload;
  } catch {
    const response = await api.get(`/users/${id}`);
    const payload = response.data as any;

    if (payload?.data?.manager) {
      return payload.data.manager;
    }

    if (payload?.data) {
      return payload.data;
    }

    return payload;
  }
};

export const createManager = async (
  payload: CreateManagerPayload
): Promise<Manager> => {
  const response = await api.post(
    "/auth/register",
    payload
  );

  return response.data;
};

export const updateManager = async (
  id: string,
  payload: Partial<CreateManagerPayload>
): Promise<Manager> => {
  const response = await api.put(
    `/users/${id}`,
    payload
  );

  return response.data;
};

export const toggleManager = async (
  id: string,
  isEnabled: boolean,
): Promise<Manager> => {
  const response = await api.patch(`/users/${id}/toggle`, { isEnabled });
  const payload = response.data as any;

  return (
    payload?.data?.user ??
    payload?.data ??
    payload?.user ??
    payload
  ) as Manager;
};

export const deleteManager = async (
  id: string
): Promise<void> => {
  await api.delete(
    `/users/${id}`
  );
};
