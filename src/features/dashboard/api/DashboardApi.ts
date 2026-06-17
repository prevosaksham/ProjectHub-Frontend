import api from "../../../api/axios";

export const getDashboardApi = async (year: any) => {
  const res = await api.get(`/dashboard?year=${year}`);

  return res.data.data;
};
