import type { Opportunity } from "../../opportunities/types/opportunity.types";

export interface RelatedModel {
    _id: string;
    name: string;
}

export interface ProjectReference {
    _id: string;
    name: string;
    status?: string;
}

export interface ContactReference {
    _id: string;
    fullName: string;
    position?: string;
}

export interface OpportunityReference {
    _id: string;
    title: string;
    stage?: string;
}

export interface Activity {
    _id: string;
    company: string | RelatedModel;
    contact: string | ContactReference | null;
    opportunity: string | OpportunityReference | null;
    project: string | RelatedModel | null;

    title: string;
    type: | "Correo" | "Llamada" | "WhatsApp" | "LinkedIn" | "Reunion"| "Demo"| "Visita"| "Otro";
    description: string;
    result: string;
    nextStep: string;
    scheduledDate: string;
    date: string;
}

export interface CreateActivityData {
    type: | "Correo" | "Llamada" | "WhatsApp" | "LinkedIn" | "Reunion"| "Demo"| "Visita"| "Otro";
    title: string;

    description?: string;
    result?: string;
    nextStep?: string;
    scheduledDate?: string;
    date?: string;
    opportunityUpdates?: {
        stage?: | "Descubrimiento" | "Propuesta" | "Negociacion" | "Contrato" | "Ganado" | "Perdido";
        probability?: number;
        estimatedAmount?: number;
        estimatedCloseDate?: string;
        expectedStartDate?: string;
        priority?: | "Baja" | "Media" | "Alta";
        lostReason?: string;
        nextAction?: string;
        nextActionDate?: string;
        notes?: string;
    };
}

export interface GetActivitiesResponse {
    activities: Activity[]
}

export interface GetActivityResponse {
    activity: Activity
}

export interface CreateActivityResponse {
    message: string;
    activity: Activity;
    opportunity: Opportunity;
    project: ProjectReference | null;
}
