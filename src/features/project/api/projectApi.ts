import type {
  CreateProjectPayload,
  Project,
  ProjectDocument,
} from "../types/project.types";
import api from "../../../api/axios";

export type ListProjectsResult = {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ListProjectsForUserResult = ListProjectsResult & {
  manager?: {
    id: string;
    name: string;
    email: string;
    role: string;
    empId: string;
    designation: string;
    mobileNumber?: string;
  };
};

export const listProjects = async (
  page = 1,
  limit = 10,
  managerId?: string,
  search?: string,
): Promise<ListProjectsResult> => {
  const queryParts = [`page=${page}`, `limit=${limit}`];

  if (managerId) {
    queryParts.push(`managerId=${managerId}`);
  }

  if (search && search.trim()) {
    queryParts.push(`search=${encodeURIComponent(search.trim())}`);
  }

  const res = await api.get(`/project/projects?${queryParts.join("&")}`);

  const payload = res.data as any;

  // Newer backend wraps data under `data.projects` with pagination metadata
  if (payload?.data?.projects) {
    const projects: Project[] = payload.data.projects;
    const total = payload.data.total ?? projects.length;
    const totalPages = payload.data.totalPages ?? 1;
    const respPage = payload.data.page ?? page;
    const respLimit = payload.data.limit ?? limit;

    return {
      projects,
      total,
      page: respPage,
      limit: respLimit,
      totalPages,
    };
  }

  // fallback when API returns projects array at top-level
  if (Array.isArray(payload?.projects)) {
    const projects: Project[] = payload.projects;
    return { projects, total: projects.length, page, limit, totalPages: 1 };
  }

  return { projects: [], total: 0, page, limit, totalPages: 1 };
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  const res = await api.get(`/project/${id}/project`);
  const payload = res.data as any;

  if (payload?.data?.project) {
    return payload.data.project as Project;
  }

  if (payload?.data) {
    return payload.data as Project;
  }

  if (payload?.project) {
    return payload.project as Project;
  }

  if (payload?.data?.data) {
    return payload.data.data as Project;
  }

  return payload as Project;
};

export const listProjectsForUser = async (
  userId: string,
  page = 1,
  limit = 10,
): Promise<ListProjectsForUserResult> => {
  const res = await api.get(
    `/users/${userId}/projects?page=${page}&limit=${limit}`,
  );
  const payload = res.data as any;

  // Extract manager info from the root of data object
  const manager = {
    id: payload?.data?.id,
    name: payload?.data?.name,
    email: payload?.data?.email,
    role: payload?.data?.role,
    empId: payload?.data?.empId,
    designation: payload?.data?.designation,
    mobileNumber: payload?.data?.mobileNumber,
  };

  const dataProjects: Project[] | undefined =
    // new API may return assignedProjects with nested project objects
    payload?.data?.projects ??
    payload?.data?.createdProjects ??
    (Array.isArray(payload?.data?.assignedProjects)
      ? payload.data.assignedProjects
          .map((ap: any) => ap.project)
          .filter(Boolean)
      : undefined);
  if (Array.isArray(dataProjects)) {
    const projects: Project[] = dataProjects;
    const total = payload?.data?.total ?? projects.length;
    const totalPages = payload?.data?.totalPages ?? 1;
    const respPage = payload?.data?.page ?? page;
    const respLimit = payload?.data?.limit ?? limit;

    return {
      projects,
      total,
      page: respPage,
      limit: respLimit,
      totalPages,
      manager,
    };
  }

  const rootProjects: Project[] | undefined =
    payload?.projects ?? payload?.createdProjects;
  if (Array.isArray(rootProjects)) {
    const projects: Project[] = rootProjects;
    return {
      projects,
      total: projects.length,
      page,
      limit,
      totalPages: 1,
      manager,
    };
  }

  return { projects: [], total: 0, page, limit, totalPages: 1, manager };
};

export type IncompleteProjectCountResult = {
  incompleteProjectCount: number;
};

export const getIncompleteProjectCount = async (
  userId: string,
): Promise<IncompleteProjectCountResult> => {
  const res = await api.get(
    `/project/user/${userId}/incomplete-projects/count`,
  );
  const payload = res.data as any;

  if (payload?.data?.incompleteProjectCount != null) {
    return { incompleteProjectCount: payload.data.incompleteProjectCount };
  }

  if (payload?.incompleteProjectCount != null) {
    return { incompleteProjectCount: payload.incompleteProjectCount };
  }

  return { incompleteProjectCount: 0 };
};

export const createProject = async (
  payload: CreateProjectPayload,
  files: File[],
  assignedUsers?: string[],
): Promise<Project> => {
  const formData = new FormData();

  // append project JSON without assignedUsers
  formData.append("project", JSON.stringify(payload));

  files.forEach((file) => {
    formData.append("documents", file);
  });

  if (assignedUsers && Array.isArray(assignedUsers)) {
    formData.append("assignedUsers", JSON.stringify(assignedUsers));
  }

  const res = await api.post("/project/create-project", formData);
  return res.data.data;
};

export const assignProjectUsers = async (
  projectId: string,
  userIds: string[],
) => {
  const res = await api.post(`/project/${projectId}/assign`, { userIds });

  return res.data;
};

export const getAssignableUsers = async () => {
  const res = await api.get("/project/assignable-users");

  return res.data.data;
};

export const updateProject = async (
  id: string,
  payload: Partial<CreateProjectPayload>,
  files: File[],
  assignedUsers?: string[],
): Promise<Project> => {
  const formData = new FormData();
  formData.append("project", JSON.stringify(payload));

  files.forEach((file) => {
    formData.append("documents", file);
  });

  if (assignedUsers && Array.isArray(assignedUsers)) {
    formData.append("assignedUsers", JSON.stringify(assignedUsers));
  }

  const res = await api.patch(`/project/update-project/${id}`, formData);
  return res.data.data;
};

export const toggleProject = async (
  id: string,
  isEnabled: boolean,
): Promise<Project> => {
  const res = await api.patch(`/project/${id}/toggle`, { isEnabled });
  const payload = res.data as any;

  return (
    payload?.data?.project ??
    payload?.data ??
    payload?.project ??
    payload
  ) as Project;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

export const uploadDocument = async (
  projectId: string,
  file: File,
): Promise<ProjectDocument> => {
  const fd = new FormData();
  fd.append("file", file);

  const res = await api.post(`/projects/${projectId}/documents`, fd);

  return res.data.data;
};

export const createProjectRemark = async (
  projectId: string,
  remark: string,
): Promise<any> => {
  const res = await api.post(`/project/${projectId}/create-remark`, { remark });

  return res.data;
};
