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
        const loadAssignableUsers = async () => {
            try {
                const users = await getAssignableUsers();
                setAssignedOptions(
                    Array.isArray(users)
                        ? users.map((user: any) => ({
                              id: user.id,
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
            });

            const assignedUserIds = Array.isArray(loadedProject.assignedUsers) && loadedProject.assignedUsers.length > 0
                ? loadedProject.assignedUsers
                : Array.isArray(loadedProject.members)
                    ? loadedProject.members
                          .map((member: any) => member.assignedTo?.id)
                          .filter(Boolean)
                    : [];

            setAssignedTo(assignedUserIds as string[]);
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
                ...data,
                assignedUsers: assignedTo,
            };
            await createProject(payload, []);
        } else if (loadedProject) {
            // For edit: send only name and assignedUsers
            const payload: CreateProjectPayload = {
                name: data.name,
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
            <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex-1 overflow-y-auto p-6"
                >
                    <div className="space-y-6">
                        <div className="rounded-t-2xl bg-[#0059FF] px-6 py-5 text-white">
                            <h2 className="text-xl font-semibold">
                                {isEditing ? "Edit Project" : "Add Project"}
                            </h2>
                        </div>

                        <div className="rounded-b-2xl bg-white p-6 shadow-sm">
                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Project Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register("name", {
                                            required: "Project name is required",
                                        })}
                                        className={`w-full rounded-xl border px-4 py-3 outline-none ${errors.name ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-blue-500"}`}
                                        placeholder="Enter Name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-500 text-[12px]">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Assigned To <span className="text-red-500">*</span>
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
                                            const selectOptions = assignedOptions.map(
                                                (option) => ({
                                                    value: option.id,
                                                    label: option.name,
                                                }),
                                            );

                                            return (
                                                <Select<
                                                    { value: string; label: string },
                                                    true
                                                >
                                                    {...field}
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    options={selectOptions}
                                                    value={selectOptions.filter((opt) =>
                                                        Array.isArray(field.value)
                                                            ? field.value.includes(opt.value)
                                                            : false,
                                                    )}
                                                    onChange={(selected) => {
                                                        const values = Array.isArray(selected)
                                                            ? selected.map((item) => item.value)
                                                            : [];
                                                        field.onChange(values);
                                                        setAssignedTo(values);
                                                        setAssignedError("");
                                                    }}
                                                    styles={{
                                                        control: (base) => ({
                                                            ...base,
                                                            width: "100%",
                                                            borderRadius: "0.75rem",
                                                            borderColor: (errors as any).assignedUsers
                                                                ? "#ef4444"
                                                                : "#cbd5e1",
                                                            minHeight: "3rem",
                                                            boxShadow: "none",
                                                            "&:hover": {
                                                                borderColor: (errors as any).assignedUsers
                                                                    ? "#ef4444"
                                                                    : "#cbd5e1",
                                                            },
                                                        }),
                                                        menu: (base) => ({
                                                            ...base,
                                                            borderRadius: "0.75rem",
                                                        }),
                                                    }}
                                                    placeholder="Select Assigned To"
                                                />
                                            );
                                        }}
                                    />
                                    {(errors as any).assignedUsers && (
                                        <p className="mt-1 text-sm text-red-500 text-[12px]">
                                            {(errors as any).assignedUsers?.message}
                                        </p>
                                    )}
                                    {assignedError && !((errors as any).assignedUsers) && (
                                        <p className="mt-1 text-sm text-red-500 text-[12px]">
                                            {assignedError}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProjectFormModal;