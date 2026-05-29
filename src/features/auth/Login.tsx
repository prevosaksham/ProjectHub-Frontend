import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import img1 from "../../assets/img/img-1.png";
import img2 from "../../assets/img/img-2.png";
import img3 from "../../assets/img/img-3.png";
import img4 from "../../assets/img/img-4.png";
import img5 from "../../assets/img/img-5.png";

import img6 from "../../assets/img/img-6.png";
import img7 from "../../assets/img/img-7.png";
import img8 from "../../assets/img/img-8.png";
import img9 from "../../assets/img/img-9.png";
import img10 from "../../assets/img/img-10.png";
import img11 from "../../assets/img/img-11.png";
import logo from "../../assets/img/Prevoyance-Logo--Blue 1.png";
import { loginUser } from "./services/auth.service";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", response.accessToken);

      localStorage.setItem("user", JSON.stringify(response.user));

      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-white overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-screen">
          <div className="hidden lg:flex lg:w-7/12 xl:w-8/12 bg-[#EDF3FF] p-2 xl:p-3 h-screen overflow-hidden">
            <div className="flex w-full h-full gap-1 overflow-hidden">
              {/* COLUMN 1 */}
              <div className="w-2/12 flex flex-col gap-1 min-h-0 overflow-hidden">
                <div className="flex-[147] min-h-0 overflow-hidden">
                  <img
                    src={img1}
                    alt=""
                    className="w-full h-full rounded-[20px_20px_20px_0px] object-cover"
                  />
                </div>

                <div className="flex-[258] min-h-0 overflow-hidden">
                  <img
                    src={img2}
                    alt=""
                    className="w-full h-full rounded-[0px_20px_20px_0px] object-cover"
                  />
                </div>

                <div className="flex-[258] min-h-0 overflow-hidden">
                  <img
                    src={img3}
                    alt=""
                    className="w-full h-full rounded-[0px_20px_20px_20px] object-cover"
                  />
                </div>
              </div>

              {/* COLUMN 2 */}
              <div className="w-4/12 flex flex-col gap-1 min-h-0 overflow-hidden">
                <div className="flex-[268] bg-gradient-to-br from-[#0D63FF] to-[#003ECB] p-3 xl:p-5 rounded-[20px] text-white flex flex-col justify-center overflow-hidden">
                  <h4 className="font-semibold text-lg xl:text-[22px] leading-[32px]">
                    Welcome To
                  </h4>

                  <h3 className="font-extrabold text-2xl xl:text-[36px] leading-tight">
                    ProjectHub
                  </h3>

                  <p className="text-xs xl:text-sm leading-5 xl:leading-7 mt-3">
                    Manage projects, collaborate with developers, track
                    progress, and organize documents from one modern dashboard
                  </p>
                </div>

                <div className="flex-[268] min-h-0 overflow-hidden">
                  <img
                    src={img4}
                    alt=""
                    className="w-full h-full rounded-[20px] object-cover"
                  />
                </div>

                <div className="flex-[163] min-h-0 overflow-hidden">
                  <img
                    src={img5}
                    alt=""
                    className="w-full h-full rounded-[20px_20px_0px_0px] object-cover"
                  />
                </div>
              </div>

              {/* COLUMN 3 */}
              <div className="w-4/12 flex flex-col gap-1 min-h-0 overflow-hidden">
                <div className="flex-[45] min-h-0 overflow-hidden">
                  <img
                    src={img6}
                    alt=""
                    className="w-full h-full rounded-[0px_0px_20px_20px] object-cover"
                  />
                </div>

                <div className="flex-[268] min-h-0 overflow-hidden">
                  <img
                    src={img7}
                    alt=""
                    className="w-full h-full rounded-[20px] object-cover"
                  />
                </div>

                <div className="flex-[268] bg-gradient-to-br from-[#0D63FF] to-[#003ECB] p-3 xl:p-5 rounded-[20px] text-white flex flex-col justify-center overflow-hidden">
                  <h3 className="font-bold text-2xl xl:text-[40px]">120+</h3>

                  <p className="font-medium text-sm xl:text-[16px]">
                    Active Projects
                  </p>

                  <div className="h-4 xl:h-6" />

                  <h3 className="font-bold text-2xl xl:text-[40px]">50+</h3>

                  <p className="font-medium text-sm xl:text-[16px]">
                    Team Members
                  </p>
                </div>

                <div className="flex-[93] min-h-0 overflow-hidden">
                  <img
                    src={img8}
                    alt=""
                    className="w-full h-full rounded-[20px_20px_0px_0px] object-cover"
                  />
                </div>
              </div>

              {/* COLUMN 4 */}
              <div className="w-2/12 flex flex-col gap-1 min-h-0 overflow-hidden">
                <div className="flex-[158] min-h-0 overflow-hidden">
                  <img
                    src={img9}
                    alt=""
                    className="w-full h-full rounded-[0px_20px_0px_20px] object-cover"
                  />
                </div>

                <div className="flex-[268] min-h-0 overflow-hidden">
                  <img
                    src={img10}
                    alt=""
                    className="w-full h-full rounded-[20px_0px_0px_20px] object-cover"
                  />
                </div>

                <div className="flex-[268] min-h-0 overflow-hidden">
                  <img
                    src={img11}
                    alt=""
                    className="w-full h-full rounded-[20px_0px_20px_20px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="w-full lg:w-5/12 xl:w-4/12 bg-white h-screen overflow-hidden">
            {/* SCROLLABLE FORM SECTION */}
            <div
              className="
      h-full
      overflow-y-auto
      px-5 sm:px-8 md:px-10
      py-8 sm:py-10

      scrollbar-thin
      scrollbar-thumb-[#0057ff]
      scrollbar-track-[#edf3ff]
      hover:scrollbar-thumb-[#0047d6]
    "
            >
              <div className="w-full max-w-[480px] mx-auto">
                {/* LOGO */}
                <div className="mb-6 sm:mb-8">
                  <img
                    src={logo}
                    alt="logo"
                    className="w-[120px] sm:w-[150px] md:w-[170px] mx-auto"
                  />
                </div>

                {/* TITLE */}
                <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-[#0057ff] mb-3">
                  Sign In
                </h2>

                <p className="text-center text-sm sm:text-base leading-6 sm:leading-7 text-gray-500 mb-7 sm:mb-8 px-2">
                  Access your project, collaborate with teams, and manage
                  everything from one dashboard.
                </p>

                {/* FORM */}
                <form onSubmit={handleLogin}>
                  {/* EMAIL */}
                  <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>

                    <div className="flex h-[50px] sm:h-[52px] overflow-hidden rounded-xl border-2 border-[#d6deff] transition focus-within:border-[#0057ff]">
                      <div className="flex w-[52px] sm:w-[55px] items-center justify-center bg-[#eef3ff] text-[#0057ff]">
                        <FiMail size={18} />
                      </div>

                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 px-4 text-sm text-gray-700 outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Password
                    </label>

                    <div className="flex h-[50px] sm:h-[52px] overflow-hidden rounded-xl border-2 border-[#d6deff] transition focus-within:border-[#0057ff]">
                      <div className="flex w-[52px] sm:w-[55px] items-center justify-center bg-[#eef3ff] text-[#0057ff]">
                        <FiLock size={18} />
                      </div>

                      <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex-1 px-4 text-sm text-gray-700 outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* OPTIONS */}
                  <div className="mb-6 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex items-center gap-2 text-gray-500">
                      <input type="checkbox" className="accent-[#0057ff]" />
                      Remember me
                    </label>

                    <button
                      type="button"
                      className="text-left font-medium text-[#0057ff] sm:text-right"
                    >
                      Forget Password?
                    </button>
                  </div>

                  {/* ERROR */}
                  {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                      {error}
                    </div>
                  )}

                  {/* BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex h-[50px] sm:h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0d63ff] to-[#003ecb] text-sm sm:text-base font-semibold text-white transition-all duration-300 ${
                      loading
                        ? "cursor-not-allowed opacity-70"
                        : "hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,87,255,0.35)]"
                    }`}
                  >
                    {loading ? "Signing In..." : "Sign In"}

                    {!loading && <FiArrowRight />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div
            className="relative flex min-h-screen items-center justify-center overflow-hidden px-3 sm:px-5 py-6 sm:py-10"
            style={{
                backgroundImage: `
      linear-gradient(
        rgba(42,52,180,0.55),
        rgba(42,52,180,0.55)
      ),
      url(${loginBg})
    `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />

            <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] max-lg:flex-col">

                <div className="relative w-1/2 bg-[rgba(18,28,140,0.92)] px-6 sm:px-10 py-8 sm:py-12 text-white backdrop-blur-xl max-lg:w-full max-lg:min-h-72 sm:max-lg:min-h-95">

                    <h4 className="mb-1 text-xl sm:text-[28px] font-medium">
                        Welcome To
                    </h4>

                    <h1 className="mb-4 sm:mb-6 text-3xl sm:text-5xl font-bold text-[#7db4ff]">
                        ProjectHub
                    </h1>

                    <p className="mb-6 sm:mb-10 max-w-md text-sm sm:text-[15px] leading-6 sm:leading-8 text-[#dbe0ff]">
                        Manage projects, collaborate
                        with developers, track
                        progress, and organize
                        documents from one modern
                        dashboard.
                    </p>
                    <div className="flex gap-3 sm:gap-5">
                        <div className="w-28 sm:w-35 rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-5 backdrop-blur-xl">
                            <h2 className="mb-1 text-2xl sm:text-3xl font-bold">
                                120+
                            </h2>

                            <span className="text-[13px] text-[#d7dcff]">
                                Active Projects
                            </span>
                        </div>

                        <div className="w-28 sm:w-35 rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-5 backdrop-blur-xl">
                            <h2 className="mb-1 text-2xl sm:text-3xl font-bold">
                                50+
                            </h2>

                            <span className="text-[13px] text-[#d7dcff]">
                                Team Members
                            </span>
                        </div>
                    </div>
                    <div className="hidden sm:block absolute bottom-7 left-10 text-xs text-[#cfd3ff]">
                        Copyright © 2026
                        ProjectHub. All rights
                        reserved.
                    </div>
                </div>

                <div className="w-1/2 bg-white px-5 sm:px-11 py-6 sm:py-8 max-lg:w-full">

                    <h2 className="mb-3 sm:mb-4 text-center text-2xl sm:text-[34px] font-bold text-[#0057ff]">
                        Sign In
                    </h2>

                    <p className="mb-5 sm:mb-8 text-center text-sm leading-6 sm:leading-7 text-gray-500">
                        Access your project,
                        collaborate with teams,
                        and manage everything from
                        one dashboard.
                    </p>
                    <form onSubmit={handleLogin}>

                        <div className="mb-6">
                            <label className="mb-2.5 block text-sm font-medium text-gray-700">
                                Email Address
                            </label>

                            <div className="flex h-13 overflow-hidden rounded-xl border-2 border-[#d6deff]">
                                <div className="flex w-13.75 items-center justify-center bg-[#eef3ff] text-[#0057ff]">
                                    <FiMail size={18} />
                                </div>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    className="flex-1 px-4 text-sm text-gray-700 outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="mb-2.5 block text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <div className="flex h-13 overflow-hidden rounded-xl border-2 border-[#d6deff]">
                                <div className="flex w-13.75 items-center justify-center bg-[#eef3ff] text-[#0057ff]">
                                    <FiLock size={18} />
                                </div>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    className="flex-1 px-4 text-sm text-gray-700 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-7 flex items-center justify-between text-[13px]">

                            <label className="flex items-center gap-2 text-gray-500">
                                <input type="checkbox" />
                                Remember me
                            </label>

                            <button
                                type="button"
                                className="font-medium text-[#0057ff]"
                            >
                                Forget Password?
                            </button>
                        </div>

                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0d63ff] to-[#003ecb] text-base font-semibold text-white transition-all duration-300 ${loading
                                    ? "cursor-not-allowed opacity-70"
                                    : "hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,87,255,0.35)]"
                                }`}
                        >
                            {loading
                                ? "Signing In..."
                                : "Sign In"}

                            {!loading && (
                                <FiArrowRight />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div> */}
    </>
  );
}

export default Login;
