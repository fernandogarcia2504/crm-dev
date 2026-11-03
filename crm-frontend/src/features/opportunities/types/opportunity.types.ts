export interface RelatedModel {
    _id: string;
    name: string;
}

export type ServiceLine = "Exposición" | "Concientización" | "Investigación y DD" | "Riesgos";

export interface Opportunity {
    _id: string;

    line?: ServiceLine;

    company: string | RelatedModel;

    serviceTemplate?: string | RelatedModel;

    project: string | RelatedModel | null;

    title: string;

    stage: | "Descubrimiento" | "Propuesta" | "Negociacion" | "Contrato" | "Ganado"| "Perdido";

    estimatedAmount: number;

    probability: number;

    estimatedCloseDate: string;

    expectedStartDate: string;

    priority: | "Baja" | "Media" | "Alta";

    lostReason?: string;

    nextAction?: string;

    nextActionDate?: string;

    lastActivityAt?: string;

    notes?: string;

    createdAt?: string;

    updatedAt?: string;
}

export interface CreateOpportunityData {
    line?: ServiceLine;

    serviceTemplateId?: string;

    title: string;

    stage: | "Descubrimiento" | "Propuesta" | "Negociacion" | "Contrato" | "Ganado" | "Perdido";

    estimatedAmount: number;

    probability: number;

    estimatedCloseDate: string;

    expectedStartDate: string;

    priority: | "Baja" | "Media" | "Alta";

    lostReason?: string;

    nextAction?: string;

    notes?: string;
}

export interface UpdateOpportunityData {
    companyId?: string;

    line?: ServiceLine;

    serviceTemplateId?: string;

    title?: string;

    stage?: | "Descubrimiento" | "Propuesta" | "Negociacion" | "Contrato" | "Ganado" | "Perdido";

    estimatedAmount?: number;

    probability?: number;

    estimatedCloseDate?: string;

    expectedStartDate?: string;

    priority?: | "Baja" | "Media"| "Alta";

    lostReason?: string;

    nextAction?: string;

    notes?: string;
}

export interface GetOpportunitiesResponse {
    opportunities: Opportunity[]
}

export interface GetOpportunityResponse {
    opportunity: Opportunity
}

export interface CreateOpportunityResponse {
    message: string;
    opportunity: Opportunity;
}

export interface UpdateOpportunityResponse {
    message: string;
    opportunity: Opportunity;
}