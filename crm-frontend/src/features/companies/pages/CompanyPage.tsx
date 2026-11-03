import { useState } from "react";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

import CreateButton from "../../../components/ui/buttons/CreateButton";
import PageHeader from "../../../components/ui/PageHeader";
import { Spinner, ErrorText, EmptyState } from "../../../components/ui/States";
import CompanyPopup from "../componentes/CompanyPopup";
import CompanyCard from "../componentes/CompanyCard";

import { useCompanies } from "../hooks/useCompanies";

export default function CompanyPage() {

    const [isOpenPopup, setIsOpenPopup] = useState(false);

    const { companies, loading, error, createCompany } = useCompanies();

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full flex flex-col"
        >
            <PageHeader
                title="Empresas"
                subtitle="Clientes y prospectos"
                count={companies.length}
                actions={<CreateButton title="Agregar empresa" onClick={() => setIsOpenPopup(true)} />}
            />

            {loading && <Spinner label="Cargando empresas..." />}
            {error && <ErrorText>{error}</ErrorText>}

            {!loading && !error && companies.length === 0 && (
                <div className="mt-8">
                    <EmptyState
                        icon={<Building2 size={28} strokeWidth={1.5} />}
                        title="Aún no hay empresas"
                        hint="Agrega tu primer cliente o prospecto para empezar a gestionarlo."
                        action={<CreateButton title="Agregar empresa" onClick={() => setIsOpenPopup(true)} />}
                    />
                </div>
            )}

            {!loading && !error && companies.length > 0 && (
                <div className="mt-6 overflow-hidden rounded-lg border border-line">
                    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.3fr)_minmax(0,1.3fr)] border-b border-line bg-surface px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.04em] text-faint">
                        <p>Empresa</p>
                        <p>Tamaño</p>
                        <p>Sitio web</p>
                        <p>Estatus</p>
                        <p className="text-right">Lead source</p>
                    </div>

                    <div className="divide-y divide-line">
                        {companies.map((company) => (
                            <CompanyCard key={company._id} company={company} />
                        ))}
                    </div>
                </div>
            )}

            {isOpenPopup && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
                    onClick={() => setIsOpenPopup(false)}
                >
                    <CompanyPopup onClose={() => setIsOpenPopup(false)} createCompany={createCompany} />
                </div>
            )}
        </motion.div>
    );
}
