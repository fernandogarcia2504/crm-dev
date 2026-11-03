import type { Company, CreateCompanyData, UpdateCompanyData, GetCompaniesResponse, GetCompanyResponse, CreateCompanyResponse, UpdateCompanyResponse, DeleteCompanyResponse } from "../types/company.types";

const API_URL = "http://localhost:3000/api";

const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
});

export const getCompanies = async (): Promise<Company[]> => {
    const response = await fetch(`${API_URL}/companies`, { headers: authHeaders() });
    if (!response.ok) throw new Error("Error al obtener las empresas");
    const data: GetCompaniesResponse = await response.json();
    return data.companies;
};

export const getCompany = async (companyId: string): Promise<Company> => {
    const response = await fetch(`${API_URL}/companies/${companyId}`, { headers: authHeaders() });
    if (!response.ok) throw new Error("Error al obtener la empresa");
    const data: GetCompanyResponse = await response.json();
    return data.company;
};

export const createCompany = async (companyData: CreateCompanyData): Promise<Company> => {
    const response = await fetch(`${API_URL}/companies`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(companyData)
    });
    const data: CreateCompanyResponse = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al crear la empresa");
    return data.company;
};

export const updateCompany = async (companyId: string, companyData: UpdateCompanyData): Promise<Company> => {
    const response = await fetch(`${API_URL}/companies/${companyId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(companyData)
    });
    const data: UpdateCompanyResponse = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al actualizar la empresa");
    return data.company;
};

export const deleteCompany = async (companyId: string): Promise<string> => {
    const response = await fetch(`${API_URL}/companies/${companyId}`, {
        method: "DELETE",
        headers: authHeaders()
    });
    const data: DeleteCompanyResponse = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al eliminar la empresa");
    return data.message;
};
