import type { SidebarMenuItem } from "../types/menu.types";

import {
  FiHome,
  FiFolder,
  FiUserCheck,
} from "react-icons/fi";

import { ROLES } from "../constants/roles";

export const sidebarMenu: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <FiHome />,
    roles: [
      ROLES.ADMIN,
      ROLES.MANAGER,
      ROLES.DEVELOPER,
    ],
  },

  {
    label: "Projects",
    path: "/projects",
    icon: <FiFolder />,
    roles: [
      ROLES.ADMIN,
    ],
  },

  {
    label: "My Projects",
    path: "/projects",
    icon: <FiFolder />,
    roles: [
      ROLES.MANAGER,
    ],
  },

  {
    label: "Users",
    path: "/users",
    icon: <FiUserCheck />,
    roles: [ROLES.ADMIN],
  },
];