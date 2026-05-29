import api from "../../../api/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;

  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const loginUser = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await api.post(
    "/auth/login",
    payload
  );

  return res.data.data;
};