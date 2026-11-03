import { useNavigate, useParams } from "react-router-dom";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

import { useTemplate } from "../hooks/useTemplate";

export default function TemplatePage() {

    const navigate = useNavigate();
    const { templateId } = useParams();

    const { template, loading, error } = useTemplate(templateId ?? null);

    return (
        <div className="w-full flex flex-col mb-12">
            <button onClick={() => navigate("/templates")} className="w-full flex flex-row items-center mt-12">
                <ChevronLeft />
                <p>Regresar</p>
            </button>

            {loading && (
                <p className="mt-8 text-[#9aa3b2]">Cargando template...</p>
            )}

            {error && (
                <p className="mt-8 text-red-400">{error}</p>
            )}

            {!loading && !error && template && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col">

                    <div className="w-full flex justify-between items-center mt-8">
                        <p className="text-lg">{template.name}</p>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm rounded-md px-3 py-1 ${template.active ? "bg-[#13241c] text-[#3fbf86]" : "bg-[#2a1619] text-[#e0912f]"}`}>
                                {template.active ? "Activo" : "Inactivo"}
                            </span>
                            <p className="text-sm text-[#9aa3b2]">Duración estimada: {template.estimatedDuration} días</p>
                        </div>
                    </div>

                    <p className="text-sm text-[#9aa3b2] mt-3">{template.description || "Sin descripción"}</p>

                    {/* Fases */}
                    <div className="border-b border-b-[#2a2f38] w-full mt-8 mb-4"></div>
                    <p>Fases</p>

                    {template.phases.length === 0 && (
                        <p className="text-sm text-[#9aa3b2] mt-3">Este template no tiene fases definidas.</p>
                    )}

                    <div className="w-full flex flex-col gap-4 mt-3">
                        {[...template.phases]
                            .sort((a, b) => a.order - b.order)
                            .map((phase, index) => (
                                <div key={phase._id ?? index} className="w-full flex flex-col rounded-lg shadow-lg bg-[#15171c] p-4 gap-3">
                                    <div className="flex justify-between items-center">
                                        <p>{phase.order}. {phase.name}</p>
                                    </div>
                                    <p className="text-sm text-[#9aa3b2]">{phase.description}</p>

                                    <div className="w-full flex flex-col gap-2 mt-2">
                                        {phase.checklist.map((task, taskIndex) => (
                                            <div key={taskIndex} className="w-full bg-[#1b1e24] rounded-sm p-3">
                                                <p className="text-sm">{task}</p>
                                            </div>
                                        ))}

                                        {phase.checklist.length === 0 && (
                                            <p className="text-sm text-[#636b78]">Sin tareas</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Entregables */}
                    <div className="border-b border-b-[#2a2f38] w-full mt-8 mb-4"></div>
                    <p>Entregables</p>

                    <div className="w-full flex flex-col gap-2 mt-3">
                        {template.deliverables.length === 0 && (
                            <p className="text-sm text-[#9aa3b2]">Sin entregables definidos.</p>
                        )}

                        {template.deliverables.map((deliverable, index) => (
                            <div key={deliverable._id ?? index} className="w-full flex justify-between items-center bg-[#15171c] rounded-md px-4 py-2">
                                <p className="text-sm">{deliverable.name}</p>
                                {deliverable.required && (
                                    <span className="text-xs text-[#9aa3b2]">Requerido</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Evidencia esperada */}
                    <div className="border-b border-b-[#2a2f38] w-full mt-8 mb-4"></div>
                    <p>Evidencia esperada</p>

                    <div className="w-full flex flex-col gap-2 mt-3">
                        {template.expectedEvidence.length === 0 && (
                            <p className="text-sm text-[#9aa3b2]">Sin evidencia definida.</p>
                        )}

                        {template.expectedEvidence.map((evidence, index) => (
                            <div key={evidence._id ?? index} className="w-full flex justify-between items-center bg-[#15171c] rounded-md px-4 py-2">
                                <p className="text-sm">{evidence.name}</p>
                                {evidence.required && (
                                    <span className="text-xs text-[#9aa3b2]">Requerido</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Estructura del proyecto */}
                    <div className="border-b border-b-[#2a2f38] w-full mt-8 mb-4"></div>
                    <p>Estructura del proyecto</p>

                    <div className="w-full flex flex-wrap gap-2 mt-3">
                        {template.projectStructure.length === 0 && (
                            <p className="text-sm text-[#9aa3b2]">Sin estructura definida.</p>
                        )}

                        {template.projectStructure.map((item, index) => (
                            <div key={index} className="bg-[#15171c] rounded-md px-3 py-1">
                                <p className="text-sm">{item}</p>
                            </div>
                        ))}
                    </div>

                    {/* KPIs */}
                    <div className="border-b border-b-[#2a2f38] w-full mt-8 mb-4"></div>
                    <p>KPIs</p>

                    <div className="w-full flex flex-wrap gap-2 mt-3">
                        {template.kpis.length === 0 && (
                            <p className="text-sm text-[#9aa3b2]">Sin KPIs definidos.</p>
                        )}

                        {template.kpis.map((kpi, index) => (
                            <div key={index} className="bg-[#15171c] rounded-md px-3 py-1">
                                <p className="text-sm">{kpi}</p>
                            </div>
                        ))}
                    </div>

                </motion.div>
            )}
        </div>
    )
}
