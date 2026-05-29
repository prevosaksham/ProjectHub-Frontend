import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

interface Crumb {
  label: string;
  to?: string;
}

interface Props {
  items?: Crumb[]; // optional - when omitted, derive from current location
  className?: string;
}

function makeLabelFromSegment(seg: string) {
  if (!seg) return "";
  // replace dashes/underscores and capitalize words
  return seg
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function Breadcrumb({ items, className }: Props) {
  const location = useLocation();

  const resolved: Crumb[] = React.useMemo(() => {
    if (items && items.length > 0) return items;

    const parts = location.pathname.split("/").filter(Boolean);
    const crumbs: Crumb[] = [{ label: "Home", to: "/" }];

    let acc = "";
    parts.forEach((p) => {
      acc += `/${p}`;
      crumbs.push({ label: makeLabelFromSegment(p), to: acc });
    });

    return crumbs;
  }, [items, location.pathname]);

  return (
    <nav className={`flex items-center gap-1 text-sm font-[Poppins] mb-2 ${className || ""}`}>
      {resolved.map((it, i) => (
        <React.Fragment key={i}>
          {it.to && i < resolved.length - 1 ? (
            <Link to={it.to} className="text-[#0059FF] hover:underline">
              {it.label}
            </Link>
          ) : (
            <span className={i < resolved.length - 1 ? "text-[#0059FF]" : "text-slate-500"}>
              {it.label}
            </span>
          )}

          {i < resolved.length - 1 && (
            <FiChevronRight size={14} className="text-slate-400" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
