import { useEffect, useState } from "react";

import { getCompanies, createCompany as createCompanyService, updateCompany as updateCompanyService, deleteCompany as deleteCompanyService } from "../services/companyService";

import type { Company, CreateCompanyData, UpdateCompanyData } from "../types/company.types";


export function useCompanies() {

    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchCompanies = async () => {
            try {
                setLoading(true);
                setError(null);
                setCompanies(await getCompanies());
            } catch (error) {
                console.error(error);
                setError(error instanceof Error ? error.message : "Error al obtener las empresas");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();

    }, []);

    const createCompany = async (companyData: CreateCompanyData) => {
        const newCompany = await createCompanyService(companyData);
        setCompanies((current) => [...current, newCompany]);
        return newCompany;
    };

    const updateCompany = async (companyId: string, companyData: UpdateCompanyData) => {
        const updatedCompany = await updateCompanyService(companyId, companyData);
        setCompanies((current) =>
            current.map((company) => (company._id === companyId ? updatedCompany : company))
        );
        return updatedCompany;
    };

    const deleteCompany = async (companyId: string) => {
        await deleteCompanyService(companyId);
        setCompanies((current) => current.filter((company) => company._id !== companyId));
    };

    return {
        companies,
        loading,
        error,
        createCompany,
        updateCompany,
        deleteCompany
    };
}
