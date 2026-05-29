import api from "../../../api/axios";

export type ProfileUser = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  empId?: string;
  designation?: string;
  role?: string;
  mobileNumber?: string;
};

export type UpdateProfilePayload = {
  name:string;
  designation: string;
  mobileNumber: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const readStoredUser = (): ProfileUser | null => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getUserFromResponse = (payload: any): ProfileUser => {
  return payload?.data?.user ?? payload?.data?.manager ?? payload?.data ?? payload;
};

const saveStoredUser = (user: ProfileUser) => {
  const storedUser = readStoredUser();
  localStorage.setItem("user", JSON.stringify({ ...storedUser, ...user }));
};

export const getProfile = async () => {
  try {
    const response = await api.get("/profile/me");
    const user = getUserFromResponse(response.data);
    saveStoredUser(user);
     return user;
  } catch (error) {
   console.log("Error while getting profile")
  }
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
) => {
  const storedUser = readStoredUser();
  const userId = storedUser?.id
  try {
    if (!userId) {
      throw new Error("Profile id is missing");
    }
    const response = await api.patch("/profile/edit-profile", payload);

  } catch (error) {
    console.log("Error ",error)
  }
};

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<void> => {
  await api.patch("/profile/change-password", payload);
};
