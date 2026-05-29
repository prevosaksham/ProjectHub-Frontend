import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import Breadcrumb from "../../components/common/Breadcrumb";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { changePassword } from "./api/profileApi";

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const inputClass =
  "w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500";

function ChangePassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      reset();
      showSuccessToast("Password changed successfully.");
      navigate("/profile");
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
          "Failed to change password. Please try again.",
      );
    }
  };

  return (
    <div className="w-full">
      <Breadcrumb
        items={[
          { to: "/", label: "Home" },
          { to: "/profile", label: "Profile" },
          { label: "Change Password" },
        ]}
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-[Poppins] text-[20px] font-semibold leading-[100%] text-[#00076F]">
          Change Password
        </h1>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="inline-flex items-center gap-2 self-start px-4 py-2 font-[Poppins] text-[14px] font-medium leading-[120%] text-[#7A7A7A] hover:bg-slate-50 sm:self-auto"
        >
          <FiArrowLeft />
          Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 w-full space-y-4 rounded-2xl bg-white p-4 shadow-[0px_4px_16px_0px_#00000014] sm:p-5 lg:p-6"
      >
        <div className="flex items-center gap-2">
          <FiLock className="text-[#0059FF]" />
          <h2 className="font-[Poppins] text-[16px] font-semibold leading-[100%] text-[#161616]">
            Password Details
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] text-[#444444]">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              className={inputClass}
              placeholder="Current password"
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] text-[#444444]">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={inputClass}
              placeholder="New password"
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] text-[#444444]">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className={inputClass}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[8px] bg-[linear-gradient(90deg,#0059FF_0%,#003699_100%)] px-6 font-[Poppins] text-[14px] font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <FiLock />
            {isSubmitting ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
