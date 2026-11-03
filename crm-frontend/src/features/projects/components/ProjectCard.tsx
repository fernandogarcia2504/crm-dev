import { useNavigate, useParams } from "react-router-dom";

import { motion } from "framer-motion";
import { Package, Calendar } from "lucide-react";

import type { Project } from "../types/project.types";
import { StatusBadge } from "../../../components/ui/Badge";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {

    const navigate = useNavigate();
    const { companyId } = useParams();

    const deliverables = project.deliverables ?? [];
    const totalDeliverables = deliverables.length;
    const completedDeliverables = deliverables.filter((d) => d.completed).length;

    const formattedDate = project.dueDate
        ? new Date(project.dueDate).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
        : "Sin fecha";

    return (
        <motion.button
            onClick={() => navigate(`/companies/${companyId}/projects/${project._id}`)}
            className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-accent/50"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
            <div className="flex items-start justify-between gap-2">
                <p className="font-medium leading-snug">{project.name}</p>
                <StatusBadge status={project.status} />
            </div>

            <div className="flex items-center justify-between text-[0.8rem] text-muted">
                <span className="flex items-center gap-1.5">
                    <Package size={14} />
                    <span className="tnum">{completedDeliverables}/{totalDeliverables} entregables</span>
                </span>
                <span className="tnum">{project.progress}%</span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-accent" style={{ width: `${project.progress}%` }} />
            </div>

            <div className="flex items-center gap-1.5 text-[0.8rem] text-faint">
                <Calendar size={14} />
                <span>Límite: {formattedDate}</span>
            </div>
        </motion.button>
    );
}
