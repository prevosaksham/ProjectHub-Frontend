import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getProjectById } from "./api/projectApi";
import type { Project } from "./types/project.types";
import ProjectFormInline from "./ProjectFormInline";

function AddEditProjects() {
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [loading, setLoading] = useState(false);
	const [loadError, setLoadError] = useState<string | null>(null);
	const location = useLocation();
	const navigate = useNavigate();

	const isViewing = Boolean(location?.state?.viewOnly);
	const isEditing = Boolean(location?.state?.projectId) && !isViewing;

	// if navigated here with a projectId in state, load that project
	useEffect(() => {
		const projectId = location?.state?.projectId;

		if (!projectId) {
			setSelectedProject(null);
			setLoadError(null);
			setLoading(false);
			return;
		}

		setLoading(true);
		setLoadError(null);

		(async () => {
			try {
				const project = await getProjectById(projectId);
				if (project) {
					setSelectedProject(project);
				} else {
					setLoadError("Project data not found.");
				}
			} catch (error: any) {
				console.error("Failed to load project for editing:", error);
				setSelectedProject(null);
				setLoadError(error?.message || "Failed to load project data.");
			} finally {
				setLoading(false);
			}
		})();
	}, [location]);

	if (loadError) {
		return (
			<div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 text-center">
				<p className="text-sm text-red-500">{loadError}</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6">
				<div>
					<ProjectFormInline project={selectedProject} isEditMode={isEditing} isViewMode={isViewing} loading={loading} onSaved={() => navigate("/projects")} />
				</div>
			</div>
		</div>
	);
}

export default AddEditProjects;
