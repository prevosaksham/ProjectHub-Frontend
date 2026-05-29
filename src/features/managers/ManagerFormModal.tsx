import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import { createManager, updateManager } from "./api/managerApi";
import type { CreateManagerPayload, Manager } from "./types/manager.types";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

interface Props {
    open: boolean;
    onClose: () => void;
    refresh: () => void;
    manager?: Manager | null;
}

function ManagerFormModal({
    open,
    onClose,
    refresh,
    manager,
}: Props) {
    const isEditing = !!manager;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } =
        useForm<CreateManagerPayload>({
            defaultValues: {
                name: "",
                email: "",
                empId: "",
                designation: "",
                mobileNumber: "",
                password: "",
                confirmPassword: "",

            },
        });

    useEffect(() => {
        if (manager) {
            reset({
                name: manager.name,
                email: manager.email,
                empId: manager.empId,
                designation: manager.designation,
                mobileNumber: manager.mobileNumber,
            });
        } else {
            reset();
        }
    }, [manager, reset]);

    const password = watch("password");

    const preventCopyPaste = (
        e:
            | React.ClipboardEvent<HTMLInputElement>
            | React.KeyboardEvent<HTMLInputElement>
    ) => {
        // prevent copy/paste/cut
        if (
            "clipboardData" in e ||
            ("ctrlKey" in e &&
                (e.key.toLowerCase() === "c" ||
                    e.key.toLowerCase() ===
                    "v" ||
                    e.key.toLowerCase() ===
                    "x"))
        ) {
            e.preventDefault();
        }
    };

    const onSubmit = async (
        data: CreateManagerPayload
    ) => {
        try {
            const payload: CreateManagerPayload =
            {
                name: data.name,
                email: data.email,
                empId:
                    data.empId,
                designation:
                    data.designation,
                password: data.password,
                mobileNumber: data.mobileNumber,
            };

            let response;

            if (isEditing && manager) {
                response = await updateManager(
                    manager.id,
                    payload
                );
            } else {
                response = await createManager(
                    payload
                );
            }

            showSuccessToast(
                response?.message ||
                'Operation successful'
            );

            refresh();
            onClose();
        } catch (error:any) {
            console.error(error);
            showErrorToast(
                error?.response?.data?.message ||
                'Something went wrong'
            );
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {isEditing
                            ? "Edit Manager"
                            : "Create Manager"}
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
                    onSubmit={handleSubmit(
                        onSubmit
                    )}
                    className="p-6"
                >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Full Name */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Full Name *
                            </label>

                            <input
                                {...register("name", {
                                    required: "Full name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Full name must be at least 2 characters",
                                    },
                                })}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="John Doe"
                            />

                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Email *
                            </label>

                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email address",
                                    },
                                })}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="manager@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Employee ID */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Employee ID *
                            </label>

                            <input
                                {...register("empId", {
                                    required: "Employee ID is required",
                                    minLength: {
                                        value: 2,
                                        message: "Employee ID must be at least 2 characters",
                                    },
                                })}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="EMP001"
                            />
                            {errors.empId && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.empId.message}
                                </p>
                            )}
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Designation
                            </label>

                            <input
                                {...register(
                                    "designation"
                                )}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="Project Manager"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-600">
                                Mobile Number
                            </label>

                            <input
                                type="tel"
                                {...register("mobileNumber", {
                                    required: "Mobile number is required",
                                    pattern: {
                                        value: /^[0-9]{10,15}$/,
                                        message: "Enter a valid mobile number",
                                    },
                                })}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                placeholder="Mobile Number"
                            />
                            {errors.mobileNumber && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.mobileNumber.message}
                                </p>
                            )}
                        </div>
                        {/* Password */}
                        {!isEditing && (
                            <>
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                                        Password *
                                    </label>

                                    <input
                                        type="password"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters",
                                            },
                                        })}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                        placeholder="********"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-semibold text-slate-600">
                                        Confirm Password *
                                    </label>

                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        onCopy={
                                            preventCopyPaste
                                        }
                                        onPaste={
                                            preventCopyPaste
                                        }
                                        onCut={
                                            preventCopyPaste
                                        }
                                        onKeyDown={
                                            preventCopyPaste
                                        }
                                        {...register(
                                            "confirmPassword",
                                            {
                                                required:
                                                    "Confirm password is required",
                                                validate:
                                                    (
                                                        value
                                                    ) =>
                                                        value ===
                                                        password ||
                                                        "Passwords do not match",
                                            }
                                        )}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                                        placeholder="********"
                                    />

                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {
                                                errors
                                                    .confirmPassword
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
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
                            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                        >
                            {isEditing
                                ? "Save Changes"
                                : "Create Manager"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ManagerFormModal;