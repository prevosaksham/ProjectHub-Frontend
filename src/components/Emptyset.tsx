import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description?: string;
};

function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-[#F1F1F1] bg-white shadow-sm min-h-[450px] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto">
          {icon}
        </div>

        <h3 className="text-lg font-semibold text-slate-800">
          {title}
        </h3>

        {description && (
          <p className="mt-2 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default EmptyState;