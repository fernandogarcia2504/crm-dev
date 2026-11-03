import { useEffect, useState } from "react";

import { getTemplates, createTemplate as createTemplateService } from "../services/templateServices";

import type { ServiceTemplate, CreateServiceTemplateData } from "../types/templates.types";

export function useTemplates() {
    const [templates, setTemplates] = useState<ServiceTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchTemplates = async () => {
            try {
                setLoading(true);
                setError(null);
                setTemplates(await getTemplates());
            } catch (error) {
                console.error(error);
                setError(error instanceof Error ? error.message : "Error al obtener los templates");
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();

    }, []);

    const createTemplate = async (templateData: CreateServiceTemplateData) => {
        const newTemplate = await createTemplateService(templateData);
        setTemplates((current) => [...current, newTemplate]);
        return newTemplate;
    };

    return {
        templates,
        loading,
        error,
        createTemplate
    };
}
