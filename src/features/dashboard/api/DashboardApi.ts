import api from "../../../api/axios";

export const getDashboardApi = async () => {

  const res = await api.get(
    "/dashboard"
  );

  return res.data.data;
};