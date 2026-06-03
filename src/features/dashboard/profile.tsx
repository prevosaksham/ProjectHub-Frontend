import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2} from "react-icons/fi";
import Breadcrumb from "../../components/common/Breadcrumb";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import { showErrorToast } from "../../utils/toast";
import { getProfile, readStoredUser } from "./api/profileApi";
import type { ProfileUser } from "./api/profileApi";

const fieldClass =
  "w-full min-w-0 rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-600 outline-none";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileUser | null>(readStoredUser());
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const user = await getProfile();
        if (active) {
          setProfile(user ?? null);
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
  }, []);

  const profileFields = [
    { label: "Full Name", value: profile?.name },
    { label: "Email", value: profile?.email },
    { label: "Employee ID", value: profile?.empId },
    { label: "Role", value: profile?.role },
    { label: "Mobile Number", value: profile?.mobileNumber },
  ];

  return (
    <div className="w-full">
      <Breadcrumb items={[{ to: "/", label: "Home" }, { label: "Profile" }]} />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-[Poppins] text-[20px] font-semibold leading-[100%] text-[#00076F]">
          My Profile
        </h1>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => navigate("/profile/edit")}
            className="inline-flex h-11.25 w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(90deg,#0059FF_0%,#003699_100%)] px-5 font-[Poppins] text-[14px] font-medium text-white transition hover:opacity-90 sm:w-auto cursor-pointer"
          >
            <FiEdit2 />
            Edit
          </button>

          
        </div>
      </div>
      {loadingProfile ? (
        <SkeletonLoader type="profile-form" count={3} />
      ) : (
        <div className="mt-4 w-full space-y-4 rounded-2xl bg-white p-4 shadow-[0px_4px_16px_0px_#00000014] sm:p-5 lg:p-6">
          <h2 className="mb-2 font-[Poppins] text-[16px] font-semibold leading-[100%] text-[#161616]">
            Profile Information
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            {profileFields.map((field) => (
              <div key={field.label}>
                <label className="mb-2 block font-[Poppins] text-[14px] font-medium leading-[100%] text-[#444444]">
                  {field.label}
                </label>
                <input
                  value={field.value || ""}
                  disabled
                  className={fieldClass}
                  placeholder={field.label}
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
