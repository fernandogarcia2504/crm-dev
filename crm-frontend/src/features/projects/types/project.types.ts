// El proyecto en el CRM es el registro COMERCIAL del compromiso.
// La ejecucion tecnica (scope, assets, fases, checklist) vive en
// atalaya-platform, ligada por projectId.

export interface RelatedModel {
    _id: string;
    name: string;
}

export interface ProjectDeliverable {
    _id: string;
    name: string;
    completed: boolean;
    version: number;
    deliveredAt: string | null;
}

export interface ProjectTimelineEntry {
    _id: string;
    title: string;
    description: string;
    user: string;
    createdAt: string;
}

export interface Project {
    _id: string;
    line?: string;
    company: string | RelatedModel | null;
    opportunity: string | (RelatedModel & { stage?: string }) | null;
    serviceTemplate: string | (RelatedModel & { description?: string }) | null;
    name: string;
    status: "Planeacion" | "Ejecucion" | "Cierre" | "Cerrado";
    manager?: string;
    startDate: string | null;
    dueDate: string | null;
    deliveryDate: string | null;
    deliverables: ProjectDeliverable[];
    timeline: ProjectTimelineEntry[];
    progress: number;
    createdAt: string;
    updatedAt: string;
}

export interface GetProjectsResponse {
    projects: Project[];
}

export interface GetProjectResponse {
    project: Project;
}
