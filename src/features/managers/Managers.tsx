import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiToggleLeft,
  FiToggleRight,
  FiUsers,
  FiEye,
  FiSearch,
  FiChevronRight,
} from "react-icons/fi";
import plusIcon from "../../assets/plus icon.png";
import { listManagers, toggleManager } from "./api/managerApi";
import type { Manager } from "./types/manager.types";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/Emptyset";

function Managers() {
  const [items, setItems] = useState<Manager[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchManagers = async (p = page) => {
    try {
      setLoading(true);

      const res = await listManagers(p, limit);

      console.log("Managers:", res.users);

      setItems(res.users);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setPage(res.page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleToggle = async (manager: Manager) => {
    try {
      const nextIsEnabled = !manager.isEnabled;
      const updated = await toggleManager(manager.id, nextIsEnabled);
      
      console.log("API Response:", updated);
      setItems((prev) =>
        prev.map((item) =>
          item.id === manager.id
            ? { ...item, isEnabled: updated.isEnabled ?? nextIsEnabled }
            : item,
        ),
      );
    } catch (error) {
      console.error("Failed to toggle manager status:", error);
    }
  };

  return (
    <div className="rounded-2xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm font-[Poppins] mb-2">
        <Link to="/" className="text-[#0059FF] hover:underline">
          Home
        </Link>
        <FiChevronRight size={14} className="text-slate-400" />
        <span className="text-slate-500">Users</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-[#00076F]">Users</h2>
          <p className="text-sm text-slate-500">({total} results found)</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:flex-none">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search"
              className="h-[40px] sm:h-[45px] w-full sm:w-80 rounded-lg border border-[#DCDCDC] bg-white py-3 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => navigate("/users/add")}
            className="inline-flex h-[40px] sm:h-[45px] items-center gap-2 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium text-white whitespace-nowrap"
            style={{
              background: "linear-gradient(90deg, #0059FF 0%, #003699 100%)",
            }}
          >
            <img src={plusIcon} alt="+" className="h-4 w-4 object-contain" />
            <span className="hidden sm:inline">Add User</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          // <div className="flex flex-col items-center justify-center p-14 text-center">
          //   <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          //     <FiUsers size={30} />
          //   </div>

          //   <h3 className="text-lg font-semibold">No managers found</h3>
          // </div>
          <EmptyState
            icon={<FiUsers size={30} />}
            title="No users found"
            description="There are no users available right now."
          />  
        ) : (
          <table className="min-w-[800px] w-full table-fixed border-separate border-spacing-y-2">
            <thead>
              <tr className="h-[45px] bg-[#EEF4FF]">
                <th className="w-[90px] pl-[30px] pr-4 py-2 text-left text-sm font-medium text-[#161616] font-[Poppins] leading-none rounded-l-lg">
                  Sr. No.
                </th>

                <th className="pl-3 pr-4 py-2 text-left text-sm font-medium text-[#161616] font-[Poppins] leading-none">
                  Name
                </th>

                <th className="pl-3 pr-4 py-2 text-left text-sm font-medium text-[#161616] font-[Poppins] leading-none">
                  Email
                </th>

                <th className="pl-3 pr-4 py-2 text-left text-sm font-medium text-[#161616] font-[Poppins] leading-none">
                  Employee ID
                </th>

                <th className="pl-3 pr-4 py-2 text-left text-sm font-medium text-[#161616] font-[Poppins] leading-none">
                  Designation
                </th>

                <th className="pl-3 pr-4 py-2 text-left text-sm font-medium text-[#161616] font-[Poppins] leading-none">
                  Mobile Number
                </th>

                <th className="pl-3 pr-[30px] py-2 text-center text-sm font-medium text-[#161616] font-[Poppins] leading-none rounded-r-lg">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {items.map((manager, index) => (
                <tr
                  key={manager.id}
                  className="h-[45px] bg-white hover:bg-slate-50"
                >
                  <td className="w-[80px] pl-[30px] pr-4 py-2 text-sm font-normal text-[#444444] font-[Poppins] leading-none rounded-l-lg border-y border-l border-[#F5F5F5]">
                    {(page - 1) * limit + index + 1}
                  </td>

                  <td className="pl-3 pr-4 py-2 text-sm font-normal text-[#444444] font-[Poppins] leading-none border-y border-[#F5F5F5] truncate max-w-0">
                    {manager.name}
                  </td>

                  <td className="pl-3 pr-4 py-2 text-sm font-normal text-[#444444] font-[Poppins] leading-none border-y border-[#F5F5F5] truncate max-w-0">
                    {manager.email}
                  </td>

                  <td className="pl-3 pr-4 py-2 text-sm font-normal text-[#444444] font-[Poppins] leading-none border-y border-[#F5F5F5] truncate max-w-0">
                    {manager.empId}
                  </td>

                  <td className="pl-3 pr-4 py-2 text-sm font-normal text-[#444444] font-[Poppins] leading-none border-y border-[#F5F5F5] truncate max-w-0">
                    {manager.designation}
                  </td>

                  <td className="pl-3 pr-4 py-2 text-sm font-normal text-[#444444] font-[Poppins] leading-none border-y border-[#F5F5F5] truncate max-w-0">
                    {manager.mobileNumber}
                  </td>

                  <td className="pl-3 pr-[30px] py-2 text-center rounded-r-lg border-y border-r border-[#F5F5F5]">
                    <div className="inline-flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/users/${manager.id}/projects`)
                        }
                        className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] gap-2 p-2 bg-[#EEF4FF] text-[#0059FF] hover:bg-[#dde9ff]"
                      >
                        <FiEye size={16} />
                      </button>

                      <button
                        onClick={() => handleToggle(manager)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${manager.isEnabled ? "bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#d7efd7]" : "bg-[#F5F5F5] text-[#6B7280] hover:bg-[#e5e7eb]"}`}
                        title={manager.isEnabled ? "Disable user" : "Enable user"}
                      >
                        {manager.isEnabled ? (
                          <FiToggleRight size={18} />
                        ) : (
                          <FiToggleLeft size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPrev={() => {
          if (page > 1) {
            fetchManagers(page - 1);
          }
        }}
        onNext={() => {
          if (page < totalPages) {
            fetchManagers(page + 1);
          }
        }}
        onPageChange={(pageNumber) => fetchManagers(pageNumber)}
      />
    </div>
  );
}

export default Managers;
