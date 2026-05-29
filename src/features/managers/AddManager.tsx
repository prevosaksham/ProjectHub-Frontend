import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { createManager } from "./api/managerApi";
import type { CreateManagerPayload } from "./types/manager.types";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Breadcrumb from "../../components/common/Breadcrumb";
import { useState } from "react";

function AddManager() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateManagerPayload>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      empId: "",
      designation: "",
      role: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const getInputClassName = (hasError?: boolean) =>
    `w-full min-w-0 rounded-xl border px-4 py-3 pr-12 outline-none ${hasError ? "border-red-500 focus:border-red-500" : "border-slate-300 focus:border-blue-500"}`;

  const password = watch("password");

  const preventCopyPaste = (
    e:
      | React.ClipboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      "clipboardData" in e ||
      ("ctrlKey" in e &&
        (e.key.toLowerCase() === "c" ||
          e.key.toLowerCase() === "v" ||
          e.key.toLowerCase() === "x"))
    ) {
      e.preventDefault();
    }
  };

  const onSubmit = async (data: CreateManagerPayload) => {
    try {
      await createManager({
        name: data.name,
        email: data.email,
        empId: data.empId,
        designation: data.designation,
        role: data.role,
        password: data.password,
        mobileNumber: data.mobileNumber,
      });

      showSuccessToast("Manager created successfully.");
      reset();
      navigate("/users");
    } catch (error: any) {
      console.error(error);
      showErrorToast(
        error?.response?.data?.message ||
          "Failed to create manager. Please try again.",
      );
    }
  };

  return (
    <div className="w-full ">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { to: "/", label: "Home" },
          { to: "/users", label: "Users" },
          { label: "Add User" },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
        <div>
          <h1 className="font-[Poppins] text-[20px] font-semibold leading-[100%] tracking-normal text-[#00076F]">
            Add Users
          </h1>
        </div>

        <button
          onClick={() => navigate("/users")}
          className="inline-flex items-center gap-2 px-4 py-2 font-[Poppins] font-medium text-[14px] leading-[120%] tracking-[-0.01em] text-[#7A7A7A] hover:bg-slate-50 self-start sm:self-auto"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>
      </div>

      <form
        id="add-manager-form"
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4"
      >
        {/* Card */}
        <div className="w-full p-4 sm:p-5 lg:p-6 space-y-4 bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014]">
          <h1 className="font-[Poppins] font-semibold text-[16px] leading-[100%] tracking-normal text-[#161616] mb-2">
            Basic Information
          </h1>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-3">
            {/* Full Name */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-normal text-[#444444]">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                })}
                className={getInputClassName(!!errors.name)}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 text-[12px]">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-normal text-[#444444]">
                Email <span className="text-red-500">*</span>
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
                className={getInputClassName(!!errors.email)}
                placeholder="manager@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 text-[12px]">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Employee ID */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-normal text-[#444444]">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                {...register("empId", {
                  required: "Employee ID is required",
                  pattern: {
                    value: /^PIS\d{4,5}$/,
                    message: "Employee ID must be like PIS10000",
                  },
                })}
                maxLength={8}
                className={getInputClassName(!!errors.empId)}
                placeholder="PIS1001"
              />
              {errors.empId && (
                <p className="mt-1 text-sm text-red-500 text-[12px]">
                  {errors.empId.message}
                </p>
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-normal text-[#444444]">
                Designation
              </label>
              <input
                {...register("designation")}
                className={getInputClassName(!!errors.designation)}
                maxLength={50}
                {...register("designation", {
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Designation should contain only letters",
                  },

                  maxLength: {
                    value: 50,
                    message: "Designation cannot exceed 50 characters",
                  },
                })}
                placeholder="Project Manager"
              />

              {errors.designation && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.designation.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-normal text-[#444444]">
                Role <span className="text-red-500">*</span>
              </label>
              <Controller
                name="role"
                control={control}
                defaultValue="Manager"
                rules={{ required: "Role is required" }}
                render={({ field }) => {
                  const options = [
                    { value: "", label: "Select Role" },
                    { value: "ADMIN", label: "Admin" },
                    { value: "MANAGER", label: "Manager" },
                    { value: "LEADERSHIP", label: "Leadership" },
                  ];

                  return (
                    <Select
                      {...field}
                      value={
                        options.find(
                          (option) => option.value === field.value,
                        ) ?? options[0]
                      }
                      onChange={(option) => field.onChange(option?.value)}
                      options={options}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "100%",
                          borderRadius: "0.75rem",
                          borderColor: errors.role ? "#ef4444" : "#cbd5e1",
                          minHeight: "3rem",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: errors.role ? "#ef4444" : "#cbd5e1",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: "0.75rem",
                        }),
                      }}
                    />
                  );
                }}
              />
              {errors.role && (
                <p className="mt-1 text-sm text-red-500 text-[12px]">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-normal text-[#444444]">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register("mobileNumber", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter a valid mobile number",
                  },
                })}
                className={getInputClassName(!!errors.mobileNumber)}
                placeholder="9876543210"
              />
              {errors.mobileNumber && (
                <p className="mt-1 text-sm text-red-500 text-[12px]">
                  {errors.mobileNumber.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-normal text-[#444444]">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  // type="password"
                  type={showPassword ? "text" : "password"}
                  form="add-manager-form"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  onCopy={preventCopyPaste}
                  onPaste={preventCopyPaste}
                  onCut={preventCopyPaste}
                  onKeyDown={preventCopyPaste}
                  className="w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 text-[12px]">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] tracking-normal text-[#444444]">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  // type="password"
                  type={showConfirmPassword ? "text" : "password"}
                  form="add-manager-form"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  onCopy={preventCopyPaste}
                  onPaste={preventCopyPaste}
                  onCut={preventCopyPaste}
                  onKeyDown={preventCopyPaste}
                  className={getInputClassName(!!errors.confirmPassword)}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500 text-[12px]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-33.75 h-11.25 rounded-lg border
        bg-[linear-gradient(90deg,#0059FF_0%,#003699_100%)]
        px-6 py-3 font-[Poppins] font-medium text-[14px]
        leading-[100%] tracking-normal text-center text-white
        transition hover:opacity-90
        disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddManager;
