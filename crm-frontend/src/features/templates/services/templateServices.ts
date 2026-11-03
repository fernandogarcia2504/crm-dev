import type { ServiceTemplate, CreateServiceTemplateData, CreateServiceTemplateResponse, GetServiceTemplateResponse, GetServiceTemplatesResponse } from "../types/templates.types";

const API_URL = "http://localhost:3000/api";

const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
});

export const getTemplates = async (): Promise<ServiceTemplate[]> => {
    const response = await fetch(`${API_URL}/service-templates`, { headers: authHeaders() });
    if (!response.ok) throw new Error("Error al obtener los templates");
    const data: GetServiceTemplatesResponse = await response.json();
    return data.serviceTemplates;
};

export const getTemplate = async (templateId: string): Promise<ServiceTemplate> => {
    const response = await fetch(`${API_URL}/service-templates/${templateId}`, { headers: authHeaders() });
    if (!response.ok) throw new Error("Error al obtener el template");
    const data: GetServiceTemplateResponse = await response.json();
    return data.serviceTemplate;
};

export const createTemplate = async (templatedata: CreateServiceTemplateData): Promise<ServiceTemplate> => {
    const response = await fetch(`${API_URL}/service-templates`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(templatedata)
    });
    const data: CreateServiceTemplateResponse = await response.json();
    if (!response.ok) throw new Error(data.message || "Error al crear el template");
    return data.serviceTemplate;
};
