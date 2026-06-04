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
      ROLES.SUPER_ADMIN,
      ROLES.MANAGER,
      ROLES.DEVELOPER,
      ROLES.ADMIN,
      ROLES.LEADER,
    ],
  },

  {
    label: "Projects",
    path: "/projects",
    icon: <FiFolder />,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.LEADER,
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
    roles: [ROLES.SUPER_ADMIN,ROLES.ADMIN],
  },
];