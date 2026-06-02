interface SkeletonLoaderProps {
  type?: "table" | "form" | "card" | "profile-form" | "project-details" | "modal-form";
  count?: number;
}

function SkeletonLoader({ type = "table", count = 5 }: SkeletonLoaderProps) {
  if (type === "table") {
    return (
      <div className="space-y-2">
        {[...Array(count)].map((_, idx) => (
          <div key={idx} className="flex gap-4 p-4 bg-white rounded-lg border border-slate-100 animate-pulse">
            <div className="h-10 w-10 bg-linear-to-r from-slate-200 to-slate-100 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-linear-to-r from-slate-200 to-slate-100 rounded"></div>
              <div className="h-3 w-48 bg-linear-to-r from-slate-100 to-slate-50 rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-linear-to-r from-slate-200 to-slate-100 rounded"></div>
              <div className="h-8 w-8 bg-linear-to-r from-slate-200 to-slate-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="h-4 w-32 bg-linear-to-r from-slate-200 to-slate-100 rounded animate-pulse"></div>
            <div className="h-10 w-full bg-linear-to-r from-slate-100 to-slate-50 rounded-lg animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "modal-form") {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-lg animate-pulse">
          <div className="mb-6 h-6 w-2/5 rounded-full bg-linear-to-r from-slate-200 to-slate-100"></div>

          <div className="space-y-5">
            {[...Array(count)].map((_, idx) => (
              <div key={idx} className="space-y-3 rounded-3xl border border-slate-100 bg-slate-50 p-4">
                <div className="h-3 w-28 rounded-full bg-linear-to-r from-slate-200 to-slate-100"></div>
                <div className="h-12 w-full rounded-2xl bg-linear-to-r from-slate-100 to-slate-50"></div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <div className="h-11 w-full rounded-2xl bg-linear-to-r from-slate-100 to-slate-50 sm:w-32"></div>
            <div className="h-11 w-full rounded-2xl bg-linear-to-r from-slate-100 to-slate-50 sm:w-40"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "profile-form") {
    return (
      <div className="w-full space-y-4 rounded-2xl bg-white p-4 shadow-[0px_4px_16px_0px_#00000014] sm:p-5 lg:p-6 animate-pulse">
        <div className="h-5 w-40 bg-linear-to-r from-slate-200 to-slate-100 rounded mb-4"></div>
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {[...Array(count * 2)].map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className="h-4 w-24 bg-linear-to-r from-slate-200 to-slate-100 rounded"></div>
              <div className="h-10 w-full bg-linear-to-r from-slate-100 to-slate-50 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "project-details") {
    return (
      <div className="space-y-6">
        <div className="w-full p-4 sm:p-5 lg:p-6 bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014] animate-pulse">
          <div className="h-5 w-48 bg-linear-to-r from-slate-200 to-slate-100 rounded mb-6"></div>
          
          {/* Basic Info Items */}
          <div className="space-y-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-12 h-12 min-w-12 bg-linear-to-r from-slate-200 to-slate-100 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 bg-linear-to-r from-slate-200 to-slate-100 rounded"></div>
                  <div className="h-4 w-40 bg-linear-to-r from-slate-100 to-slate-50 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-12 h-12 min-w-12 bg-linear-to-r from-slate-200 to-slate-100 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 bg-linear-to-r from-slate-200 to-slate-100 rounded"></div>
                  <div className="h-4 w-32 bg-linear-to-r from-slate-100 to-slate-50 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Section */}
        <div className="w-full p-4 sm:p-5 lg:p-6 bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014] animate-pulse">
          <div className="h-5 w-32 bg-linear-to-r from-slate-200 to-slate-100 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-12 bg-linear-to-r from-slate-100 to-slate-50 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Remarks Section */}
        <div className="w-full p-4 sm:p-5 lg:p-6 bg-white rounded-2xl shadow-[0px_4px_16px_0px_#00000014] animate-pulse">
          <div className="h-5 w-24 bg-linear-to-r from-slate-200 to-slate-100 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="h-16 bg-linear-to-r from-slate-100 to-slate-50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // card type
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, idx) => (
        <div key={idx} className="p-4 bg-white rounded-lg border border-slate-100 animate-pulse">
          <div className="h-4 w-full bg-linear-to-r from-slate-200 to-slate-100 rounded mb-3"></div>
          <div className="h-4 w-5/6 bg-linear-to-r from-slate-100 to-slate-50 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;
