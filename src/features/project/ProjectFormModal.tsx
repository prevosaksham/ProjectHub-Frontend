import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

import {
    createProject,
    getAssignableUsers,
    getProjectById,
    updateProject,
} from "./api/projectApi";

import type { CreateProjectPayload, Project } from "./types/project.types";

interface Props {
    open: boolean;
    onClose: () => void;
    refresh: () => void;
    project?: Project | null;
}

function ProjectFormModal({
    open,
    onClose,
    refresh,
    project,
}: Props) {
    const isEditing = !!project;

    const [saving, setSaving] = useState(false);
    const [assignedTo, setAssignedTo] = useState<string[]>([]);
    const [assignedOptions, setAssignedOptions] = useState<
        { id: string; name: string; email?: string }[]
    >([]);
    const [assignedError, setAssignedError] = useState("");
    const [loadedProject, setLoadedProject] = useState<Project | null>(null);

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<CreateProjectPayload>({
        defaultValues: {
            name: "",
            status: "PLANNING",
            priority: "MEDIUM",
            assignedUsers: [],
        } as any,
    });

    useEffect(() => {
        const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = String(currentUser?.role || "").toUpperCase();

  if (
    role !== "SUPER_ADMIN" &&
    role !== "ADMIN"
  ) {
    return;
  }
        const loadAssignableUsers = async () => {
            try {
                const users = await getAssignableUsers();
                setAssignedOptions(
                    Array.isArray(users)
                        ? users.map((user: any) => ({
                            id: String(user.id),
                            name: user.name || user.email || "Unknown",
                            email: user.email,
                        }))
                        : [],
                );
            } catch (error) {
                console.error("Unable to load assignable users", error);
            }
        };

        loadAssignableUsers();
    }, []);

    // Fetch project data from API when in edit mode
    useEffect(() => {
        if (open && isEditing && project?.id) {
            (async () => {
                try {
                    const fetchedProject = await getProjectById(project.id);
                    if (fetchedProject) {
                        setLoadedProject(fetchedProject);
                    }
                } catch (error) {
                    console.error("Failed to load project for editing:", error);
                }
            })();
        } else if (!open) {
            setLoadedProject(null);
        }
    }, [open, isEditing, project?.id]);

    useEffect(() => {
        if (loadedProject && assignedOptions.length > 0) {
            reset({
                name: loadedProject.name,
                status: loadedProject.status,
                priority: loadedProject.priority,
                assignedUsers: loadedProject.assignedUsers ?? [],
            });

            const assignedUserIds = Array.isArray(loadedProject.assignedUsers) && loadedProject.assignedUsers.length > 0
                ? loadedProject.assignedUsers
                : Array.isArray(loadedProject.members)
                    ? loadedProject.members
                        .map((member: any) => member.assignedTo?.id)
                        .filter(Boolean)
                    : [];

            setAssignedTo((assignedUserIds as any[]).map((id) => String(id)));
        } else if (!loadedProject) {
            reset({
                name: "",
                status: "PLANNING",
                priority: "MEDIUM",
            });
            setAssignedTo([]);
            setAssignedError("");
        }
    }, [loadedProject, assignedOptions.length, reset]);

    useEffect(() => {
        setValue("assignedUsers" as any, assignedTo);
    }, [assignedTo, setValue]);

    const onSubmit = async (
        data: CreateProjectPayload
    ) => {
        if (assignedTo.length === 0) {
            setAssignedError("Assigned To is required");
            return;
        }

        try {
            setSaving(true);

            if (!isEditing) {
                const payload: CreateProjectPayload = {
                    name: data.name
                };
                await createProject(payload, [], assignedTo);
            } else if (loadedProject) {
                const payload: CreateProjectPayload = {
                    name: data.name
                };
                await updateProject(loadedProject.id, payload, [], assignedTo);
                window.dispatchEvent(new Event("projectUpdated"));
            }
            refresh();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-105 overflow-hidden rounded-2xl bg-white shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between bg-[#2F54EB] px-5 py-4"style={{
                background: "linear-gradient(90deg, #0059FF 0%, #003699 100%)",
              }}>
                    <h2 className="text-lg font-semibold text-white">
                        {isEditing ? "Edit Project" : "Add Project"}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white text-xl cursor-pointer hover:text-gray-200 hover:opacity-90"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Body */}
                    <div className="space-y-6 p-5">
                        {/* Project Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-[14px] font-[Poppins] text-[#444444]">
                                Project Name <span className="text-red-500">*</span>
                            </label>

                            <input
                                {...register("name", {
                                    required: "Project name is required",
                                })}
                                placeholder="Enter Name"
                                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ${errors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />

                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Assigned To */}
                        <div>
                            <label className="mb-2 block text-sm text-[14px] font-[Poppins] font-medium text-[#444444]">
                                Assigned To
                            </label>

                            <Controller
                                name={"assignedUsers" as any}
                                control={control}
                                rules={{
                                    validate: (value) =>
                                        Array.isArray(value) && value.length > 0
                                            ? true
                                            : "Assigned To is required",
                                }}
                                render={({ field }) => {
                                    const selectOptions = assignedOptions.map((option) => ({
                                        value: option.id,
                                        label: option.name,
                                    }));

                                    const selectedValues = Array.isArray(field.value)
                                        ? field.value.map((item) => String(item))
                                        : [];

                                    const hasAssignedError = Boolean(
                                        errors.assignedUsers?.message || assignedError,
                                    );

                                    return (
                                        <Select
                                            {...field}
                                            isMulti={true}
                                            options={selectOptions}
                                            placeholder="Select"
                                            menuPortalTarget={document.body}
                                            menuPosition="fixed"
                                            menuPlacement="auto"
                                            classNamePrefix="project-select"
                                            value={selectOptions.filter((opt) =>
                                                selectedValues.includes(opt.value),
                                            )}
                                            onChange={(selected: any) => {
                                                const values = Array.isArray(selected)
                                                    ? selected.map((item) => String(item.value))
                                                    : [];

                                                field.onChange(values);

                                                setAssignedTo(values);

                                                setAssignedError("");
                                            }}
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    minHeight: "46px",
                                                    borderRadius: "8px",
                                                    borderColor: hasAssignedError
                                                        ? "#dc2626"
                                                        : state.isFocused
                                                            ? "#2563EB"
                                                            : "#D1D5DB",
                                                    boxShadow: "none",
                                                    "&:hover": {
                                                        borderColor: hasAssignedError
                                                            ? "#dc2626"
                                                            : "#2563EB",
                                                    },
                                                }),

                                                valueContainer: (base) => ({
                                                    ...base,
                                                    padding: "0 12px",
                                                }),

                                                placeholder: (base) => ({
                                                    ...base,
                                                    color: "#6B7280",
                                                }),

                                                indicatorSeparator: () => ({
                                                    display: "none",
                                                }),

                                                dropdownIndicator: (base) => ({
                                                    ...base,
                                                    color: "#6B7280",
                                                }),

                                                menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 99999,
                                                }),

                                                menu: (base) => ({
                                                    ...base,
                                                    borderRadius: "10px",
                                                    overflow: "hidden",
                                                    marginTop: "4px",
                                                    paddingRight: "2px",
                                                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                                }),

                                                menuList: (base) => ({
                                                    ...base,
                                                    maxHeight: "180px",
                                                    padding: 0,
                                                    overflowY: "auto",

                                                    /* Firefox */
                                                    scrollbarWidth: "thin",
                                                    scrollbarColor: "#9CA3AF #F3F4F6",
                                                }),

                                                option: (base, state) => ({
                                                    ...base,
                                                    padding: "14px 16px",
                                                    fontSize: "15px",
                                                    cursor: "pointer",
                                                    backgroundColor: state.isFocused
                                                        ? "#DCEAFE"
                                                        : state.isSelected
                                                            ? "#DCEAFE"
                                                            : "#FFFFFF",
                                                    color: "#222222",
                                                }),
                                            }}
                                        />
                                    );
                                }}
                            />

                            {(assignedError || errors.assignedUsers?.message) && (
                                <p className="mt-1 text-xs text-red-500">
                                    {assignedError || errors.assignedUsers?.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-center bg-[#EEF2FA] px-5 py-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-[#0059FF] px-8 py-2.5 text-sm font-medium hover:opacity-90 text-white hover:bg-[#0047CC]"
                            style={{
                                background: "linear-gradient(90deg, #0059FF 0%, #003699 100%)",
                            }}
                        >
                            {saving ? "Saving..." : "Save Details"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProjectFormModal;