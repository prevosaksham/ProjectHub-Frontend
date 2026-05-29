// export type ManagerStatus =
//   | "ACTIVE"
//   | "INACTIVE";

export interface Manager {
  message: string;
  id: string;
  name: string;
  email: string;
  empId: string;
  designation: string;
  mobileNumber?: string;
  isEnabled?: boolean;
  // createdAt?: string;
}

export interface CreateManagerPayload {
  name: string;
  email: string;
  empId: string;
  designation: string;
  role?: "" | "Manager" | "Leadership";
  mobileNumber?: string;
  password?: string;
  confirmPassword?: string;
  isEnabled?: boolean;
//   status: ManagerStatus;
}