export type ProjectStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "REVIEW"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED";

export type ProjectPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ProjectMember {
  assignedTo?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

export interface ProjectDocument {
  url: any;
  id: string;
  projectId?: string;
  filename?: string;
  originalName?: string;
  name?: string;
  mimeType?: string;
  fileType?: string;
  fileSize?: string;
  size?: number;
  uploadedAt?: string;
  createdAt?: string;
  file?: File;
}

export interface Project {
  isSetupCompleted: boolean;
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  clientName: string | null;
  managerId?: string | null;
  // budget: string | null;
  startDate: string | null;
  endDate: string | null;
  developers: string[];
  devUrl: string | null;
  uatUrl: string | null;
  prodUrl: string | null;
  // ownerId: string;
  documents: ProjectDocument[];
  assignedUsers?: string[];
  isEnabled?: boolean;
  members?: ProjectMember[];
  remarks: Remark[];
  // createdAt: string;
  // updatedAt: string;
}

export type Remark = {
  remark: string;
  createdAt: string;
  addedBy: {
    name: string;
  };
};

export interface CreateProjectPayload {
  name: string;
  description?: string | null;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  clientName?: string | null;

  startDate?: string | null;
  endDate?: string | null;
  developers?: string[];
  assignedUsers?: string[];
  devUrl?: string | null;
  uatUrl?: string | null;
  prodUrl?: string | null;
  documents?: ProjectDocument[];
  isEnabled?: boolean;
  validate?: (value: string) => boolean | string;
}
