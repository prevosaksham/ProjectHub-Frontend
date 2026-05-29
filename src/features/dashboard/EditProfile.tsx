import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import Breadcrumb from "../../components/common/Breadcrumb";
import Loader from "../../components/common/Loader";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { getProfile, readStoredUser, updateProfile } from "./api/profileApi";
import type { ProfileUser } from "./api/profileApi";

type EditProfileFormValues = {
  name: string;
  email: string;
  empId: string;
  designation: string;
  role: string;
  mobileNumber: string;
};

const roleOptions = [
  { value: "", label: "Select Role" },
  { value: "MANAGER", label: "Manager" },
  { value: "LEADERSHIP", label: "Leadership" },
  { value: "ADMIN", label: "Admin" },
];

const normalizeProfile = (
  user?: ProfileUser | null,
): EditProfileFormValues => ({
  name: user?.name ?? "",
  email: user?.email ?? "",
  empId: user?.empId ?? "",
  designation: user?.designation ?? "",
  role: user?.role ?? "",
  mobileNumber: user?.mobileNumber ?? "",
});

const inputClass =
  "w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

function EditProfile() {
  const navigate = useNavigate();
  const [loadingProfile, setLoadingProfile] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormValues>({
    mode: "onBlur",
    defaultValues: normalizeProfile(readStoredUser()),
  });

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const user = await getProfile();

        if (active) {
          reset(normalizeProfile(user));
        }
      } catch (error: any) {
        if (active) {
          showErrorToast(
            error?.response?.data?.message ||
              "Unable to load profile details.",
          );
        }
      } finally {
        if (active) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [reset]);

  const onSubmit = async (data: EditProfileFormValues) => {
    try {
      await updateProfile({
        name: data.name,
        designation: data.designation,
        mobileNumber: data.mobileNumber,
      });

      showSuccessToast("Profile updated successfully.");
      navigate("/profile");
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    }
  };

  return (
    <div className="w-full">
      <Breadcrumb
        items={[
          { to: "/", label: "Home" },
          { to: "/profile", label: "Profile" },
          { label: "Edit Profile" },
        ]}
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-[Poppins] text-[20px] font-semibold leading-[100%] text-[#00076F]">
          Edit Profile
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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="w-full space-y-4 rounded-2xl bg-white p-4 shadow-[0px_4px_16px_0px_#00000014] sm:p-5 lg:p-6">
          <h2 className="mb-2 font-[Poppins] text-[16px] font-semibold leading-[100%] text-[#161616]">
            Profile Information
          </h2>

          {loadingProfile ? (
            <Loader className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-5" />
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] text-[#444444]">
                  Full Name
                </label>
                <input
                  {...register("name")}
                  className={inputClass}
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] text-[#444444]">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  disabled
                  className={inputClass}
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] text-[#444444]">
                  Employee ID
                </label>
                <input
                  {...register("empId")}
                  disabled
                  className={inputClass}
                  placeholder="Employee ID"
                />
              </div>

              <div>
                <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] text-[#444444]">
                  Designation
                </label>
                <input
                  {...register("designation")}
                  className={inputClass}
                  placeholder="Designation"
                />
              </div>

              <div>
                <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] text-[#444444]">
                  Role <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                       isDisabled={true}
                      value={
                        roleOptions.find(
                          (option) => option.value === field.value,
                        ) ?? roleOptions[0]
                      }
                      onChange={(option) => field.onChange(option?.value)}
                      options={roleOptions}
                      styles={{
                        control: (base) => ({
                          ...base,
                          width: "100%",
                          borderRadius: "0.75rem",
                          borderColor: "#cbd5e1",
                          minHeight: "3rem",
                          boxShadow: "none",
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: "0.75rem",
                        }),
                      }}
                    />
                  )}
                />
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">
                    
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] text-[#444444]">
                  Mobile Number <span className="text-red-500">*</span>
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
                  className={inputClass}
                  placeholder="Mobile number"
                />
                {errors.mobileNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="h-[45px] w-full rounded-lg border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || loadingProfile}
            className="inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[8px] bg-[linear-gradient(90deg,#0059FF_0%,#003699_100%)] px-6 font-[Poppins] text-[14px] font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-[135px]"
          >
            <FiSave />
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
