import type { Project, GetProjectsResponse, GetProjectResponse } from "../types/project.types";

const API_URL = "http://localhost:3000/api/projects";

export const getProjects = async (companyId: string): Promise<Project[]> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data: GetProjectsResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            "Error al obtener los proyectos de la empresa"
        );
    }

    return data.projects;
};

export const getProject = async (companyId: string, projectId: string): Promise<Project> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}/${projectId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data: GetProjectResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            "Error al obtener el proyecto"
        );
    }

    return data.project;
};
