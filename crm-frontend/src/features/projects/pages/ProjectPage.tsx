import { useNavigate, useParams } from "react-router-dom";

import { motion } from "framer-motion";
import { ChevronLeft, Package, Clock, ShieldCheck } from "lucide-react";

import { useProject } from "../hooks/useProject";
import type { RelatedModel } from "../types/project.types";

import { Spinner, ErrorText } from "../../../components/ui/States";
import { StatusBadge } from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";

const relatedName = (value: unknown): string => {
    if (value && typeof value === "object" && "name" in value) {
        return (value as RelatedModel).name;
    }
    return "—";
};

const fmtDate = (value: string | null) =>
    value
        ? new Date(value).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })
        : "—";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between border-b border-line py-2.5 last:border-b-0">
            <span className="text-[0.82rem] text-muted">{label}</span>
            <span className="text-[0.85rem] font-medium">{value}</span>
        </div>
    );
}

export default function ProjectPage() {

    const navigate = useNavigate();
    const { companyId, projectId } = useParams();

    const { project, loading, error } = useProject(companyId ?? null, projectId ?? null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full flex flex-col pb-10"
        >
            <button
                onClick={() => navigate(`/companies/${companyId}/projects`)}
                className="mt-9 flex w-fit items-center gap-1.5 text-[0.84rem] text-muted transition-colors hover:text-ink"
            >
                <ChevronLeft size={16} /> Proyectos
            </button>

            {loading && <Spinner label="Cargando proyecto..." />}
            {error && <ErrorText>{error}</ErrorText>}

            {!loading && !error && project && (
                <>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-[1.4rem] font-semibold tracking-tight">{project.name}</h1>
                                <StatusBadge status={project.status} />
                            </div>
                            <p className="mt-1 text-[0.85rem] text-muted">{relatedName(project.company)}</p>
                        </div>
                        <div className="text-right">
                            <p className="tnum text-[1.6rem] font-semibold leading-none">{project.progress}%</p>
                            <p className="mt-1 text-[0.72rem] uppercase tracking-wide text-faint">Avance comercial</p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                        {/* entregables + bitácora */}
                        <section className="rounded-lg border border-line bg-surface p-5">
                            <div className="mb-3 flex items-center gap-2">
                                <Package size={16} className="text-accent" />
                                <h2 className="text-[0.95rem] font-semibold">Entregables</h2>
                            </div>

                            {(project.deliverables ?? []).length === 0 ? (
                                <p className="py-6 text-center text-[0.84rem] text-faint">Sin entregables definidos</p>
                            ) : (
                                <div className="flex flex-col">
                                    {project.deliverables.map((d) => (
                                        <div key={d._id} className="flex items-center justify-between border-b border-line py-2.5 last:border-b-0">
                                            <div className="flex items-center gap-2.5">
                                                <span
                                                    className={[
                                                        "flex h-4 w-4 items-center justify-center rounded-full border",
                                                        d.completed ? "border-good bg-good/15 text-good" : "border-line-2 text-transparent"
                                                    ].join(" ")}
                                                >
                                                    <ShieldCheck size={11} />
                                                </span>
                                                <span className="text-[0.86rem]">{d.name}</span>
                                            </div>
                                            <span className="text-[0.76rem] text-faint">
                                                {d.completed ? `Entregado · v${d.version}` : "Pendiente"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mb-3 mt-7 flex items-center gap-2">
                                <Clock size={16} className="text-accent" />
                                <h2 className="text-[0.95rem] font-semibold">Bitácora</h2>
                            </div>
                            {(project.timeline ?? []).length === 0 ? (
                                <p className="py-6 text-center text-[0.84rem] text-faint">Sin movimientos registrados</p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {project.timeline.map((t) => (
                                        <div key={t._id} className="border-l-2 border-line-2 pl-3">
                                            <p className="text-[0.86rem] font-medium">{t.title}</p>
                                            {t.description && <p className="text-[0.8rem] text-muted">{t.description}</p>}
                                            <p className="mt-0.5 text-[0.72rem] text-faint">
                                                {t.user} · {fmtDate(t.createdAt)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* detalle comercial */}
                        <aside className="flex flex-col gap-5">
                            <div className="rounded-lg border border-line bg-surface p-5">
                                <h2 className="mb-2 text-[0.95rem] font-semibold">Detalle</h2>
                                <InfoRow label="Oportunidad" value={relatedName(project.opportunity)} />
                                <InfoRow label="Servicio" value={relatedName(project.serviceTemplate)} />
                                <InfoRow label="Responsable" value={project.manager || "—"} />
                                <InfoRow label="Inicio" value={fmtDate(project.startDate)} />
                                <InfoRow label="Límite" value={fmtDate(project.dueDate)} />
                                <InfoRow label="Entrega" value={fmtDate(project.deliveryDate)} />
                            </div>

                            <div className="rounded-lg border border-dashed border-line-2 bg-surface/50 p-4">
                                <p className="text-[0.8rem] font-medium text-muted">Ejecución técnica</p>
                                <p className="mt-1 text-[0.78rem] leading-relaxed text-faint">
                                    El scope, los assets y el avance técnico de este proyecto se gestionan en la
                                    plataforma de operación.
                                </p>
                                <Button variant="secondary" size="sm" className="mt-3 w-full" disabled>
                                    Abrir en plataforma
                                </Button>
                            </div>
                        </aside>
                    </div>
                </>
            )}
        </motion.div>
    );
}
