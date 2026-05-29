import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiMail,
  FiPhone,
  FiUser,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiLink,
  FiChevronDown,
  FiExternalLink,
} from "react-icons/fi";

import type { Project } from "../project/types/project.types";
import { listProjectsForUser } from "../project/api/projectApi";
import StatusBadge from "../project/StatusBadge";
import PriorityBadge from "../project/PriorityBadge";
import Breadcrumb from "../../components/common/Breadcrumb";
import Loader from "../../components/common/Loader";

interface Manager {
  name?: string;
  designation?: string;
  email?: string;
  empId?: string;
  mobileNumber?: string;
}

function ViewDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [manager, setManager] = useState<Manager | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (value?: string | null) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!id) {
      setError("Manager ID is missing.");
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);

        const result = await listProjectsForUser(id);

        setManager(result.manager || null);
        setProjects(result.projects ?? []);
      } catch {
        setError("Unable to load manager details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Breadcrumb
            items={[
              { to: "/", label: "Home" },
              { to: "/users", label: "Users" },
              { label: "User Details" },
            ]}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-2 mb-3">
        <h2 className="text-lg sm:text-xl font-semibold text-[#00076F]">
          User Details
        </h2>
        <button
          onClick={() => navigate("/users")}
          className="inline-flex items-center gap-2 px-4 py-2 
          font-[Poppins] font-medium text-[14px] leading-[120%]
          tracking-[-0.01em] text-[#7A7A7A] hover:bg-slate-50 
          rounded-lg"
        >
          <FiArrowLeft />
          Back
        </button>
      </div>
      {/* Loading / Error */}
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="p-10 text-center text-red-600">{error}</div>
      ) : (
        <div className="space-y-6 mt-3">
          {/* Manager Card */}
          <section className="rounded-3xl bg-[#0059FF] px-6 py-5 text-white shadow-lg bg-[linear-gradient(90deg,#0059FF_0%,#003699_100%)] before:bg-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0059FF]">
                  <FiUser size={22} />
                </div>

                <div>
                  <h3 className="text-[18px] font-semibold">
                    {manager?.name || "—"}
                  </h3>
                  <p className="text-sm text-blue-100">
                    {manager?.designation || "—"}
                  </p>
                </div>
              </div>

              {/* Inline Info */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-white">
                <div className="flex items-center gap-2">
                  <FiMail className="text-white/80" />
                  <span>{manager?.email || "—"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FiBriefcase className="text-white/80" />
                  <span>{manager?.empId || "—"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FiPhone className="text-white/80" />
                  <span>{manager?.mobileNumber || "No mobile number"}</span>
                </div>
              </div>

              {/* Project Count */}
              <div className="rounded-full bg-white px-5 py-2 text-sm font-medium text-slate-800 shadow">
                {projects.length} Assigned Project
                {projects.length !== 1 ? "s" : ""}
              </div>
            </div>
          </section>

          {/* Projects */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Projects</h3>
            {/* <p className="mt-1 text-sm text-slate-500">
              Details for projects connected to this manager.
            </p> */}
          </div>
          <section className="">
            {projects.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
                No projects found for this user.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {projects.map((project) => (
                  <details
                    key={project.id}
                    className="group w-full overflow-hidden bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014]"
                  >
                    {/* Accordion Header */}
                    <summary className="flex cursor-pointer items-start justify-between gap-4 px-5 py-4 list-none rounded-2xl hover:bg-slate-50 group-open:rounded-b-none">
                      <div className="min-w-0">
                        <h4 className="truncate text-[15px] font-semibold text-slate-900">
                          {project.name}
                        </h4>

                        {/* <p className="mt-1 truncate text-sm text-slate-500">
        {project.description || "No description available."}
      </p> */}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <PriorityBadge priority={project.priority} />
                        <StatusBadge status={project.status} />

                        <FiChevronDown className="h-5 w-5 text-slate-400 transition-transform duration-300 group-open:rotate-180" />
                      </div>
                    </summary>

                    {/* Accordion Body */}
                    <div className="border-t border-[#E5E7EB] px-6 py-5">
                      <div className="grid grid-cols-1 gap-y-6 gap-x-10 md:grid-cols-2 xl:grid-cols-3">
                        {/* Client */}
                        <div className="flex items-start gap-4">
                          <div className="flex h-9.5 w-9.5 items-center justify-center rounded-[10px] bg-[#EEF4FF]">
                            <FiUser className="text-[18px] text-[#0059FF]" />
                          </div>

                          <div>
                            <p className="font-[Poppins] font-medium text-[12px] leading-[100%] tracking-[0%] uppercase text-[#7A7A7A]">
                              Client
                            </p>

                            <p className="mt-0.5 font-[Poppins] font-medium text-[14px] leading-[100%] tracking-[0%] text-[#161616]">
                              {project.clientName || "—"}
                            </p>
                          </div>
                        </div>

                        {/* Start Date */}
                        <div className="flex items-start gap-4">
                          <div className="flex h-9.5 w-9.5 items-center justify-center rounded-[10px] bg-[#EEF4FF]">
                            <FiCalendar className="text-[18px] text-[#0059FF]" />
                          </div>

                          <div>
                            <p className="font-[Poppins] font-medium text-[12px] leading-[100%] tracking-[0%] uppercase text-[#7A7A7A]">
                              Start Date
                            </p>

                            <p className="mt-0.5 font-[Poppins] font-medium text-[14px] leading-[100%] tracking-[0%] text-[#161616]">
                              {formatDate(project.startDate)}
                            </p>
                          </div>
                        </div>

                        {/* End Date */}
                        <div className="flex items-start gap-4">
                          <div className="flex h-9.5 w-9.5 items-center justify-center rounded-[10px] bg-[#EEF4FF]">
                            <FiCalendar className="text-[18px] text-[#0059FF]" />
                          </div>

                          <div>
                            <p className="font-[Poppins] font-medium text-[12px] leading-[100%] tracking-[0%] uppercase text-[#7A7A7A]">
                              End Date
                            </p>

                            <p className="mt-0.5 font-[Poppins] font-medium text-[14px] leading-[100%] tracking-[0%] text-[#161616]">
                              {formatDate(project.endDate)}
                            </p>
                          </div>
                        </div>

                        {/* Developers */}
                        <div className="flex items-start gap-4">
                          <div className="flex h-9.5 w-9.5 items-center justify-center rounded-[10px] bg-[#EEF4FF]">
                            <FiUsers className="text-[18px] text-[#0059FF]" />
                          </div>

                          <div>
                            <p className="font-[Poppins] font-medium text-[12px] leading-[100%] tracking-[0%] uppercase text-[#7A7A7A]">
                              Developers
                            </p>

                            <p className="mt-0.5 font-[Poppins] font-medium text-[14px] leading-[100%] tracking-[0%] text-[#161616]">
                              {project.developers?.join(", ") || "—"}
                            </p>
                          </div>
                        </div>

                        {/* Documents */}
                        <div className="flex items-start gap-4">
                          <div className="flex h-9.5 w-9.5 items-center justify-center rounded-[10px] bg-[#EEF4FF]">
                            <FiFileText className="text-[18px] text-[#0059FF]" />
                          </div>

                          <div>
                            <p className="font-[Poppins] font-medium text-[12px] leading-[100%] tracking-[0%] uppercase text-[#7A7A7A]">
                              Documents
                            </p>

                            <p className="mt-0.5 font-[Poppins] font-medium text-[14px] leading-[100%] tracking-[0%] text-[#161616]">
                              {project.documents?.length ?? 0}
                            </p>
                          </div>
                        </div>

                        {/* URLs */}
                        <div className="flex items-start gap-4">
                          <div className="flex h-9.5 w-9.5 items-center justify-center rounded-[10px] bg-[#EEF4FF]">
                            <FiLink className="text-[18px] text-[#0059FF]" />
                          </div>

                          <div className="min-w-0">
                            <p className="font-[Poppins] font-medium text-[12px] leading-[100%] tracking-[0%] uppercase text-[#7A7A7A]">
                              URL
                            </p>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              {project.devUrl && (
                                <a
                                  href={project.devUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded bg-[#EEF4FF] px-2 py-1 text-xs font-medium text-[#0059FF]"
                                >
                                  DEV <FiExternalLink size={10} />
                                </a>
                              )}
                              {project.uatUrl && (
                                <a
                                  href={project.uatUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded bg-[#FFF4E5] px-2 py-1 text-xs font-medium text-[#B76E00]"
                                >
                                  UAT <FiExternalLink size={10} />
                                </a>
                              )}
                              {project.prodUrl && (
                                <a
                                  href={project.prodUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 rounded bg-[#E8F5E9] px-2 py-1 text-xs font-medium text-[#2E7D32]"
                                >
                                  PROD <FiExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}


export default ViewDetails;
