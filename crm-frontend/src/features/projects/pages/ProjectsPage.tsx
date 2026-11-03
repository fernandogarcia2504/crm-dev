import { useParams } from "react-router-dom";

import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";

import ProjectCard from "../components/ProjectCard";
import PageHeader from "../../../components/ui/PageHeader";
import { Spinner, ErrorText, EmptyState } from "../../../components/ui/States";

import { useProjects } from "../hooks/useProjects";

export default function ProjectsPage() {

    const { companyId } = useParams();

    const { projects, loading, error } = useProjects(companyId ?? null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full flex flex-col"
        >
            <PageHeader
                title="Proyectos"
                subtitle="Compromisos comerciales de este cliente"
                count={projects.length}
            />

            {loading && <Spinner label="Cargando proyectos..." />}
            {error && <ErrorText>{error}</ErrorText>}

            {!loading && !error && projects.length === 0 && (
                <div className="mt-8">
                    <EmptyState
                        icon={<FolderOpen size={28} strokeWidth={1.5} />}
                        title="No hay proyectos registrados"
                        hint="Un proyecto se crea automáticamente cuando una oportunidad se marca como Ganado."
                    />
                </div>
            )}

            {!loading && !error && projects.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                </div>
            )}
        </motion.div>
    );
}
