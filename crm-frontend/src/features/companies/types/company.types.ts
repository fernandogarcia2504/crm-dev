export type ServiceLine = "Exposición" | "Concientización" | "Investigación y DD" | "Riesgos";

export const SERVICE_LINES: ServiceLine[] = ["Exposición", "Concientización", "Investigación y DD", "Riesgos"];

export interface Company {
    _id: string;

    name: string;
    website: string;
    companySize: string;
    leadSource?: string;
    lines?: ServiceLine[];
    status: string;
    notes?: string;
    address?: {
        country: string;
        state: string;
        city: string;
        pc: string;
        street: string
    }
}

export interface CreateCompanyData {
    name: string;
    website: string;
    companySize: string;
    leadSource?: string;
    lines?: ServiceLine[];
    status?: string;
    notes?: string;
    address?: {
        country?: string;
        state?: string;
        city?: string;
        pc?: string;
        street?: string
    }
}

export interface UpdateCompanyData {
    name?: string;
    website?: string;
    companySize?: string;
    leadSource?: string;
    lines?: ServiceLine[];
    status?: string;
    notes?: string;
    address?: {
        country?: string;
        state?: string;
        city?: string;
        pc?: string;
        street?: string
    }
}

export interface GetCompaniesResponse {
    companies: Company[];
}

export interface GetCompanyResponse {
    company: Company;
}

export interface CreateCompanyResponse {
    message: string;
    company: Company;
}

export interface UpdateCompanyResponse {
    message: string;
    company: Company;
}

export interface DeleteCompanyResponse {
    message: string;
}