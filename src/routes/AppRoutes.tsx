import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../features/dashboard/Dashboard";
import MainLayout from "../layouts/MainLayout";
import Login from "../features/auth/Login";
import Projects from "../features/project/Project";
import AddEditProjects from "../features/project/AddEditProjects";
import ViewProject from "../features/project/ViewProject";
import Managers from "../features/managers/Managers";
import AddManager from "../features/managers/AddManager";
import ViewDetails from "../features/managers/ViewDetails";
import Profile from "../features/dashboard/profile";
import EditProfile from "../features/dashboard/EditProfile";
import ChangePassword from "../features/dashboard/ChangePassword";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" />} />

        <Route path="dashboard" element={<Dashboard/>} />

        <Route path="projects" element={<Projects/>} />
        <Route path="projects/add-edit" element={<AddEditProjects/>} />
        <Route path="projects/view/:id" element={<ViewProject/>} />
        <Route path="my-projects" element={<Projects/>} />
        <Route path="users" element={<Managers/>} />
        <Route path="users/add" element={<AddManager/>} />
        <Route path="users/:id/projects" element={<ViewDetails/>} />
        <Route path="profile" element={<Profile/>} />
        <Route path="profile/edit" element={<EditProfile/>} />
        <Route path="change-password" element={<ChangePassword/>} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
