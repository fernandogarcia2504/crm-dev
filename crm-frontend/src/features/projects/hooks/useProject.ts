import { useEffect, useState } from "react";

import { getProject } from "../services/projectService";

import type { Project } from "../types/project.types";

export function useProject(companyId: string | null, projectId: string | null) {

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        if (!companyId || !projectId) {
            setProject(null);
            return;
        }

        const fetchProject = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getProject(companyId, projectId);

                setProject(data);

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error ? error.message : "Error al obtener el proyecto"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchProject();

    }, [companyId, projectId]);

    return {
        project,
        loading,
        error
    };

}
