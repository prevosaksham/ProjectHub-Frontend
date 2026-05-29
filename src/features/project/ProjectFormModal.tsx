import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
    createProject,
    updateProject,
} from "./api/projectApi";


import {
    FiX,
    FiUploadCloud,
    FiTrash2,
    FiFileText,
    FiUser,
} from "react-icons/fi";
import type { CreateProjectPayload, Project, ProjectDocument, ProjectPriority, ProjectStatus } from "./types/project.types";

interface Props {
    open: boolean;
    onClose: () => void;
    refresh: () => void;
    project?: Project | null;
}

const statuses: {
    value: ProjectStatus;
    label: string;
}[] = [
        { value: "PLANNING", label: "Planning" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "REVIEW", label: "Review" },
        { value: "COMPLETED", label: "Completed" },
        { value: "ON_HOLD", label: "On Hold" },
        { value: "CANCELLED", label: "Cancelled" },
    ];

const priorities: {
    value: ProjectPriority;
    label: string;
}[] = [
        { value: "LOW", label: "Low" },
        { value: "MEDIUM", label: "Medium" },
        { value: "HIGH", label: "High" },
        { value: "CRITICAL", label: "Critical" },
    ];

function ProjectFormModal({
    open,
    onClose,
    refresh,
    project,
}: Props) {
    const isEditing = !!project;

    const [saving, setSaving] = useState(false);

    const [uploadingFile, setUploadingFile] =
        useState(false);

    const [developerInput, setDeveloperInput] =
        useState("");

    const [developers, setDevelopers] = useState<
        string[]
    >([]);

    const [documents, setDocuments] = useState<
        ProjectDocument[]
    >([]);

    const {
        register,
        handleSubmit,
        reset,
        // setValue,
        // watch,
        formState: { errors },
    } = useForm<CreateProjectPayload>({
        defaultValues: {
            name: "",
            description: "",
            status: "PLANNING",
            priority: "MEDIUM",
            clientName: "",
            startDate: "",
            endDate: "",
            devUrl: "",
            uatUrl: "",
            prodUrl: "",
        },
    });

    useEffect(() => {
        if (project) {
            reset({
                name: project.name,
                description: project.description || "",
                status: project.status,
                priority: project.priority,
                clientName: project.clientName || "",
                startDate:
                    project.startDate?.slice(0, 10) || "",
                endDate:
                    project.endDate?.slice(0, 10) || "",
                devUrl: project.devUrl || "",
                uatUrl: project.uatUrl || "",
                prodUrl: project.prodUrl || "",
            });

            setDevelopers(project.developers || []);

            setDocuments(project.documents || []);
        } else {
            reset();

            setDevelopers([]);

            setDocuments([]);
        }
    }, [project, reset]);

    const validateUrl = (value: any) => {
        if (!value || typeof value !== "string") return true;

        try {
            const url = new URL(value);

            return (
                url.protocol === "http:" ||
                url.protocol === "https:"
            );
        } catch {
            return false;
        }
    };

    const addDeveloper = () => {
        const value = developerInput.trim();

        if (!value) return;

        if (developers.includes(value)) {
            setDeveloperInput("");
            return;
        }

        setDevelopers([...developers, value]);

        setDeveloperInput("");
    };

    const removeDeveloper = (name: string) => {
        setDevelopers(
            developers.filter((d) => d !== name)
        );
    };

    const handleDeveloperKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();

            addDeveloper();
        }
    };

const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
        return;
    }

    try {
        setUploadingFile(true);

        const selectedDocs = Array.from(
            files
        ).map((file) => ({
            id: crypto.randomUUID(),
            originalName: file.name,
            size: file.size,
            file,
        }));

        setDocuments((prev: any) => [
            ...selectedDocs,
            ...prev,
        ]);
    } catch (error) {
        console.error(
            "File selection failed",
            error
        );
    } finally {
        setUploadingFile(false);
    }
};

const onSubmit = async (
    data: CreateProjectPayload
) => {
    try {
        setSaving(true);

        const payload: CreateProjectPayload = {
            ...data,
            developers,
        };

        // CREATE
        if (!isEditing) {
            await createProject(
                payload,
                documents
                    .map((doc) => doc.file)
                    .filter((f): f is File => !!f),
                undefined,
            );
        }

        // UPDATE
        else if (project) {
            await updateProject(
                project.id,
                payload,
                documents
                    .map((doc) => doc.file)
                    .filter((f): f is File => !!f),
                undefined,
            );
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

    const removeDocument = (
        id: string
    ) => {
        setDocuments((prev) =>
            prev.filter((doc) => doc.id !== id)
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {isEditing
                            ? "Edit Project"
                            : "Add New Project"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-slate-100"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex-1 overflow-y-auto p-6"
                >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {/* Name */}
                        <div className="xl:col-span-3">
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Project Name *
                            </label>

                            <input
                                {...register("name", {
                                    required: true,
                                })}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="Phoenix Migration"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    Project name is required
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="xl:col-span-3">
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Description
                            </label>

                            <textarea
                                rows={4}
                                {...register("description")}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="Project description"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Status
                            </label>

                            <select
                                {...register("status")}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            >
                                {statuses.map((s) => (
                                    <option
                                        key={s.value}
                                        value={s.value}
                                    >
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Priority
                            </label>

                            <select
                                {...register("priority")}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            >
                                {priorities.map((p) => (
                                    <option
                                        key={p.value}
                                        value={p.value}
                                    >
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Client */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Client Name
                            </label>

                            <input
                                {...register("clientName")}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="Optional"
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Start Date
                            </label>

                            <input
                                type="date"
                                {...register("startDate")}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                End Date
                            </label>

                            <input
                                type="date"
                                {...register("endDate")}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Environment URLs */}
                        <div className="space-y-4 xl:col-span-3">
                            <label className="block text-sm font-semibold text-slate-600">
                                Environment Links
                            </label>

                            {[
                                {
                                    name: "devUrl",
                                    label: "DEV",
                                    color:
                                        "bg-blue-100 text-blue-700",
                                },
                                {
                                    name: "uatUrl",
                                    label: "UAT",
                                    color:
                                        "bg-orange-100 text-orange-700",
                                },
                                {
                                    name: "prodUrl",
                                    label: "PROD",
                                    color:
                                        "bg-green-100 text-green-700",
                                },
                            ].map((env) => (
                                <div
                                    key={env.name}
                                    className="grid grid-cols-[80px_1fr] gap-3"
                                >
                                    <div
                                        className={`flex items-center justify-center rounded-lg text-xs font-bold ${env.color}`}
                                    >
                                        {env.label}
                                    </div>

                                    <input
                                        {...register(
                                            env.name as keyof CreateProjectPayload,
                                            {
                                                validate: validateUrl,
                                            }
                                        )}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                        placeholder={`https://${env.label.toLowerCase()}.example.com`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Developers */}
                        <div className="xl:col-span-3">
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Developers
                            </label>

                            <div className="flex gap-3">
                                <input
                                    value={developerInput}
                                    onChange={(e) =>
                                        setDeveloperInput(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={
                                        handleDeveloperKeyDown
                                    }
                                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                    placeholder="Type name and press Enter"
                                />

                                <button
                                    type="button"
                                    onClick={addDeveloper}
                                    className="rounded-xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Chips */}
                            <div className="mt-4 flex flex-wrap gap-3">
                                {developers.map((dev) => (
                                    <div
                                        key={dev}
                                        className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
                                    >
                                        <FiUser size={14} />

                                        {dev}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeDeveloper(dev)
                                            }
                                        >
                                            <FiX size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Documents */}
                      {/* Documents */}
<div className="xl:col-span-3">
    <label className="mb-3 block text-sm font-semibold text-slate-600">
        Documents
    </label>

    {/* Upload Button */}
    <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100">
            <FiUploadCloud size={18} />

            {uploadingFile
                ? "Uploading Files..."
                : "Upload Documents"}

            <input
                type="file"
                hidden
                multiple
                onChange={handleFileUpload}
            />
        </label>

        <span className="text-sm text-slate-500">
            Multiple files supported
        </span>
    </div>

    {/* Empty State */}
    {documents.length === 0 && (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center">
            <FiFileText
                size={36}
                className="mx-auto text-slate-400"
            />

            <p className="mt-3 text-sm text-slate-500">
                No documents uploaded yet
            </p>
        </div>
    )}

    {/* Document List */}
    <div className="mt-5 space-y-3">
        {documents.map((doc, index) => (
            <div
                key={doc.id || index}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-blue-300 hover:bg-blue-50/40"
            >
                {/* Left */}
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white shadow-sm">
                        <FiFileText
                            size={18}
                            className="text-slate-500"
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">
                            {doc.originalName ||
                                "Uploaded File"}
                        </p>

                        <p className="text-xs text-slate-500">
                            {doc.size
                                ? `${(
                                      doc.size /
                                      1024 /
                                      1024
                                  ).toFixed(2)} MB`
                                : "File"}
                        </p>
                    </div>
                </div>

                {/* Delete */}
                <button
                    type="button"
                    onClick={() =>
                        removeDocument(doc.id)
                    }
                    className="ml-4 flex h-10 w-10 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-100"
                >
                    <FiTrash2 size={18} />
                </button>
            </div>
        ))}
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