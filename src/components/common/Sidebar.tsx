import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { sidebarMenu } from "../../utils/sidebarMenu";
import { getIncompleteProjectCount } from "../../features/project/api/projectApi";
import { ROLES } from "../../constants/roles";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function Sidebar({ collapsed, mobileOpen, onMobileClose }: SidebarProps) {
  const [incompleteProjectCount, setIncompleteProjectCount] = useState<number>(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role;
  const userId = user?.id;

  useEffect(() => {
    const fetchIncompleteProjectCount = async () => {
      if (userRole !== ROLES.MANAGER || !userId) {
        setIncompleteProjectCount(0);
        return;
      }

      try {
        const data = await getIncompleteProjectCount(userId);
        setIncompleteProjectCount(data.incompleteProjectCount ?? 0);
      } catch (error) {
        console.warn("Failed to fetch incomplete project count:", error);
        setIncompleteProjectCount(0);
      }
    };

    fetchIncompleteProjectCount();

    const handleProjectUpdated = () => {
      fetchIncompleteProjectCount();
    };

    window.addEventListener("projectUpdated", handleProjectUpdated);

    return () => {
      window.removeEventListener("projectUpdated", handleProjectUpdated);
    };
  }, [userRole, userId]);

  const filteredMenu = sidebarMenu.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-screen shrink-0 overflow-y-auto bg-white text-white transition-all duration-300
        lg:sticky lg:z-10
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        ${collapsed ? "w-24" : "w-64"}
      `}
    >
      {/* Top Section */}
      <div className="flex h-20 items-center justify-start px-5">
        {collapsed ? (
          <div className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#0059FF_0%,#003699_100%)] text-lg font-extrabold text-white shadow-[0_10px_25px_rgba(0,89,255,0.35)] transition-all duration-300 hover:scale-105">
            {/* Glow */}
            <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Text */}
            <span className="relative z-10 tracking-wide">PH</span>
          </div>
        ) : (
          <h1 className="ml-3 text-2xl font-bold">
            <span className="text-[#0059FF]">Project</span>
            <span className="text-[#00076F]">Hub</span>
          </h1>
        )}
      </div>

      {/* Menu */}
      <nav className="mt-4 flex flex-col gap-2 px-3">
        {filteredMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => onMobileClose?.()}
            className={({ isActive }) =>
              `group relative flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition-all duration-300 ${isActive
                ? "bg-[linear-gradient(90deg,#0059FF_0%,#003699_100%)] text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)] before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:rounded-l before:bg-white before:content-['']"
                : "text-[#161616] hover:bg-slate-100"
              }`
            }
          >
            <span className="flex items-center gap-4">
              <span className="flex items-center justify-center text-xl">
                {item.icon}
              </span>
              {!collapsed && (
                <span className="whitespace-nowrap text-sm font-bold font-[Mulish]">
                  {item.label}
                </span>
              )}
            </span>
            {item.label === "My Projects" && incompleteProjectCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-2 text-[0.65rem] font-semibold text-white">
                {incompleteProjectCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
