import type { ReactNode } from "react";
export interface SidebarMenuItem {
  label: string;
  path: string;
  icon: ReactNode;
  roles: string[];
}