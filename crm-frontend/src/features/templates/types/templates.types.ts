export interface ServiceTemplatePhase {
    _id?: string;
    name: string;
    order: number;
    description: string;
    checklist: string[];
}

export interface ServiceTemplateDeliverable {
    _id?: string;
    name: string;
    required: boolean;
}

export interface ServiceTemplateExpectedEvidence {
    _id?: string;
    name: string;
    required: boolean;
}

export interface ServiceTemplate {
    _id: string;
    line?: string;

    name: string;
    description: string;
    active: boolean;

    phases: ServiceTemplatePhase[];
    deliverables: ServiceTemplateDeliverable[];
    expectedEvidence: ServiceTemplateExpectedEvidence[];

    projectStructure: string[];
    estimatedDuration: number;
    kpis: string[];
}

export interface CreateServiceTemplateData {
    name: string;
    description: string;
    active: boolean;

    phases: ServiceTemplatePhase[];
    deliverables: ServiceTemplateDeliverable[];
    expectedEvidence: ServiceTemplateExpectedEvidence[];

    projectStructure: string[];
    estimatedDuration: number;
    kpis: string[];
}

export interface GetServiceTemplatesResponse {
    serviceTemplates: ServiceTemplate[];
}

export interface GetServiceTemplateResponse {
    serviceTemplate: ServiceTemplate;
}

export interface CreateServiceTemplateResponse {
    message: string;
    serviceTemplate: ServiceTemplate;
}