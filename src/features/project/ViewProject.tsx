import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Folder,
  FileText,
  Users,
  Hourglass,
  ListOrdered,
  UserCircle,
  CalendarDays,
  Eye,
  User,
} from "lucide-react";
import { FiArrowLeft, FiX } from "react-icons/fi";
import Breadcrumb from "../../components/common/Breadcrumb";
import Loader from "../../components/common/Loader";
import { createProjectRemark, getProjectById } from "./api/projectApi";
import type { Project, Remark } from "./types/project.types";
import { extractDateTime } from "../../utils/contants";
import toast from "react-hot-toast";

function ViewProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [remarkLoading, setRemarkLoading] = useState(false);
  const [openDevelopersModal, setOpenDevelopersModal] = useState(false);

  const [previewDocument, setPreviewDocument] = useState<any | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const getDocumentUrl = (doc: any) => {
    const docBaseUrl = import.meta.env.VITE_DOC_VIEW_URL?.replace(/\/$/, "");
    const rawUrl = doc?.url || doc?.path || doc?.fileUrl || "";

    if (!rawUrl) return "";
    if (String(rawUrl).startsWith("http")) return String(rawUrl);
    if (docBaseUrl) {
      const cleanPath = String(rawUrl).startsWith("/")
        ? String(rawUrl).slice(1)
        : String(rawUrl);
      return `${docBaseUrl}/${cleanPath}`;
    }
    return String(rawUrl);
  };

  const canPreviewInIframe = (doc: any) => {
    const url = getDocumentUrl(doc);
    if (!url) return false;
    if (doc.file) return true;

    try {
      const parsed = new URL(url);
      return parsed.origin === window.location.origin;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    let objectUrl: string | null = null;

    const loadPreview = async () => {
      if (!previewDocument) {
        setPreviewUrl("");
        setPreviewError("");
        setPreviewLoading(false);
        return;
      }

      setPreviewError("");
      const directUrl = getDocumentUrl(previewDocument);
      if (previewDocument.file) {
        objectUrl = URL.createObjectURL(previewDocument.file);
        setPreviewUrl(objectUrl);
        setPreviewLoading(false);
        return;
      }

      if (!directUrl) {
        setPreviewUrl("");
        setPreviewError("Preview URL unavailable.");
        return;
      }

      if (canPreviewInIframe(previewDocument)) {
        setPreviewUrl(directUrl);
        return;
      }

      setPreviewLoading(true);
      try {
        const response = await fetch(directUrl);
        if (!response.ok) {
          throw new Error(`Preview fetch failed: ${response.status}`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } catch (error) {
        console.error("Failed to load preview blob", error);
        setPreviewUrl("");
        setPreviewError(
          "Unable to preview this document in the embedded frame.",
        );
      } finally {
        setPreviewLoading(false);
      }
    };

    loadPreview();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [previewDocument]);

  useEffect(() => {
    if (!id) {
      setLoadError("Project ID is missing.");
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        const data = await getProjectById(id);
        if (!data) {
          setLoadError("Project data not found.");
          setProject(null);
        } else {
          setProject(data);
        }
      } catch (error: any) {
        console.error("Failed to load project details:", error);
        setLoadError(error?.message || "Failed to load project details.");
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loadError) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 text-center">
        <p className="text-sm text-red-500">{loadError}</p>
      </div>
    );
  }

  const assignedToList: string[] =
    project?.members?.map((m: any) => m?.assignedTo?.name).filter(Boolean) ||
    [];
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  const userRole = String(currentUser?.role || "").toUpperCase();
  const isAdmin = userRole === "ADMIN";

  const projectData = [
    {
      icon: <Folder size={20} className="text-blue-600" />,
      label: "PROJECT NAME",
      value: project?.name || "-",
    },
    {
      icon: <FileText size={20} className="text-blue-600" />,
      label: "DESCRIPTION",
      value: project?.description || "-",
    },
    ...(isAdmin
      ? [
          {
            icon: <Users size={20} className="text-blue-600" />,
            label: "ASSIGNED TO",
            value:
              assignedToList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {assignedToList.map((name) => (
                    <span
                      key={name}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ) : (
                "-"
              ),
          },
        ]
      : []),
    {
      icon: <Users size={20} className="text-blue-600" />,
      label: "DEVELOPERS",
      value:
        project?.developers && project?.developers?.length > 0 ? (
          <div className="flex items-center gap-3 flex-wrap">
            {project.developers.slice(0, 3).map((developer: string) => (
              <span
                key={developer}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
              >
                {developer}
              </span>
            ))}

            {project?.developers && project.developers.length > 3 && (
              <button
                type="button"
                onClick={() => setOpenDevelopersModal(true)}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                +{project.developers.length - 3} more
              </button>
            )}
          </div>
        ) : (
          "-"
        ),
    },
  ];

  const bottomData = [
    {
      icon: <Hourglass size={20} className="text-blue-600" />,
      label: "STATUS",
      value: project?.status || "-",
    },
    {
      icon: <ListOrdered size={20} className="text-blue-600" />,
      label: "PRIORITY",
      value: project?.priority || "-",
    },
    {
      icon: <UserCircle size={20} className="text-blue-600" />,
      label: "CLIENT",
      value: project?.clientName || "-",
    },
    {
      icon: <CalendarDays size={20} className="text-blue-600" />,
      label: "START DATE",
      value: project?.startDate
        ? new Date(project.startDate).toLocaleDateString()
        : "-",
    },
    {
      icon: <CalendarDays size={20} className="text-blue-600" />,
      label: "END DATE",
      value: project?.endDate
        ? new Date(project.endDate).toLocaleDateString()
        : "-",
    },
  ];

  const docs = project?.documents || [];

  const handleRemarkSave = async (remark: string) => {
    if (!id) return;
    try {
      setRemarkLoading(true);
      const response = await createProjectRemark(id, remark);
      console.log("Remark save response:", response);
      if (response.success) {
        setRemark("");
        toast.success(response?.message || "Remark added successfully!");

        const updatedProject = await getProjectById(id);

        setProject(updatedProject);
      }
    } catch (error) {
      console.error("Error saving remark:", error);
      toast.error("Failed to save remark. Please try again.");
      return;
    } finally {
      setRemarkLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { to: "/", label: "Home" },
          { to: "/projects", label: "Projects" },
          { label: "Project Details" },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 ">
        <h1 className="mt-5 font-[Poppins] text-[20px] font-semibold leading-[100%] tracking-[0px] text-[#00076F]">
          Project Details
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 font-[Poppins] font-medium text-[14px] leading-[120%] tracking-[-0.01em] text-[#7A7A7A] hover:bg-slate-50 self-start sm:self-auto"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full p-4 sm:p-5 lg:p-6 bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014]">
            <h1 className="font-[Poppins] font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#161616] mb-3">
              Basic Information
            </h1>

            <div className="space-y-6">
              {projectData.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 min-w-[48px] flex items-center justify-center rounded-lg bg-[#EAF2FF]">
                    {item.icon}
                  </div>

                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-xs uppercase text-[#7A7A7A]">
                      {item.label}
                    </p>

                    {typeof item.value === "string" ? (
                      <p className="font-medium text-sm sm:text-base leading-6 text-[#1E1E1E]">
                        {item.value}
                      </p>
                    ) : (
                      <div className="font-medium text-sm sm:text-base leading-6 text-[#1E1E1E]">
                        {item.value}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {bottomData.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 min-w-[48px] flex items-center justify-center rounded-lg bg-[#EAF2FF]">
                    {item.icon}
                  </div>

                  <div className="flex-1 space-y-2">
                    <p className="font-medium text-xs uppercase text-[#7A7A7A]">
                      {item.label}
                    </p>

                    <p className="font-medium text-sm sm:text-base leading-6 text-[#1E1E1E] break-words">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {previewDocument && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4">
              <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                      Document Preview
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 truncate">
                      {previewDocument?.originalName ||
                        previewDocument?.name ||
                        previewDocument?.filename ||
                        (previewDocument?.url
                          ? String(previewDocument.url).split("/").pop()
                          : "Untitled")}
                    </p>
                  </div>
                  <button
                    onClick={() => setPreviewDocument(null)}
                    className="rounded-lg p-2 hover:bg-slate-100"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <div className="h-[60vh] sm:h-[75vh] bg-slate-100">
                  {previewLoading ? (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                      Loading document preview...
                    </div>
                  ) : previewUrl ? (
                    <iframe
                      title={
                        previewDocument?.originalName || "document-preview"
                      }
                      src={previewUrl}
                      className="h-full w-full rounded-b-2xl"
                    />
                  ) : previewError ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-sm text-slate-500">
                      <p className="text-center">{previewError}</p>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                      Document preview is not available for this file.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="w-full p-4 sm:p-5 lg:p-6 bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014]">
            <h1 className="font-[Poppins] font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#161616] mb-4">
              Documents
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {docs.length > 0 ? (
                docs.map((doc: any, index: number) => {
                  const name =
                    doc?.originalName ||
                    doc?.name ||
                    doc?.filename ||
                    String(doc?.url || "")
                      .split("/")
                      .pop() ||
                    "Untitled";
                  return (
                    <div
                      key={doc.id || index}
                      className="flex items-center justify-between bg-[#EEF4FF] rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 flex items-center justify-center">
                          <FileText size={22} className="text-[#0059FF]" />
                        </div>

                        <p className="font-medium text-sm sm:text-base text-[#1E1E1E] truncate">
                          {name}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPreviewDocument(doc)}
                        className="ml-3"
                      >
                        <Eye size={20} className="text-[#00076F]" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl bg-[#f9fafc] px-4 py-6 text-sm text-slate-500">
                  No documents available
                </div>
              )}
            </div>
          </div>
          <div className="w-full p-4 sm:p-5 lg:p-6 bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014]">
            <h1 className="font-[Poppins] font-semibold text-[16px] leading-[100%] tracking-[0%] text-[#161616] mb-4">
              Remarks
            </h1>

            {/* Input Section */}
            {userRole !== "ADMIN" && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-start mb-5">
                <textarea
                  placeholder="Enter Here..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="
              w-full
              border border-gray-300
              rounded-xl
              p-3 sm:p-4
              text-sm sm:text-base
              outline-none
              resize-none
              h-16 sm:h-15
              focus:ring-2 focus:ring-blue-500
            "
                />

                <button
                  className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5 sm:px-6
              py-3
              rounded-xl
              font-medium
              transition-all
              w-full sm:w-auto
              self-stretch sm:self-auto
              h-16 sm:h-15
            "
                  disabled={remark.trim() === "" || remarkLoading}
                  onClick={() => handleRemarkSave(remark)}
                >
                  {remarkLoading ? "Saving..." : "Save"}
                </button>
              </div>
            )}

            {/* Remarks List */}
            <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
              {project?.remarks && project?.remarks?.length > 0 ? (
                project?.remarks?.map((item: Remark) => (
                  <div
                    key={item?.createdAt}
                    className="bg-[#F5F5F5] rounded-2xl p-4 sm:p-5"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="
                    w-8
                    h-8
                    rounded-[20px]
                    flex
                    items-center
                    justify-center
                    bg-white
                  "
                        >
                          <User size={14} className="text-blue-500" />
                        </div>

                        <h3
                          className="
                    font-[Poppins]
                    font-medium
                    text-[14px]
                    text-[#7A7A7A]
                  "
                        >
                          {item?.addedBy?.name}
                        </h3>
                      </div>

                      <span className="text-xs sm:text-sm text-gray-500">
                        {extractDateTime(item.createdAt).date}{" "}
                        {extractDateTime(item.createdAt).time}
                      </span>
                    </div>

                    {/* Remark Text */}
                    <p
                      className="
                font-[Poppins]
                font-medium
                text-[14px]
                text-[#161616]
              "
                    >
                      {item?.remark}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-[#f9fafc] px-4 py-6 text-sm text-slate-500">
                  No remarks added yet.
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {openDevelopersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Developers
                </h2>

                <p className="text-sm text-slate-500">
                  {project?.developers?.length} Members
                </p>
              </div>

              <button
                onClick={() => setOpenDevelopersModal(false)}
                className="rounded-lg p-2 transition hover:bg-slate-100"
              >
                <FiX size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[350px] overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                {project?.developers?.map(
                  (developer: string, index: number) => (
                    <div
                      key={developer}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {/* Number */}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                        {index + 1}
                      </div>

                      {/* Name */}
                      <p className="text-sm font-medium text-slate-800">
                        {developer}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewProject;
