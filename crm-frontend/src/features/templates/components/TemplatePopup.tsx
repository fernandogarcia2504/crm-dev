import { useState } from "react";

import { X, File, Plus } from "lucide-react";

import type {
    CreateServiceTemplateData,
    ServiceTemplatePhase
} from "../types/templates.types";

interface TemplatePopupProps {
    onClose: () => void;

    createTemplate: (
        templateData: CreateServiceTemplateData
    ) => Promise<unknown>;
}

const emptyPhase = (order: number): ServiceTemplatePhase => ({
    name: "",
    order,
    description: "",
    checklist: []
});

export default function TemplatePopup({ onClose, createTemplate }: TemplatePopupProps) {

    const [formData, setFormData] = useState<CreateServiceTemplateData>({
        name: "",
        description: "",
        active: true,
        phases: [],
        deliverables: [],
        expectedEvidence: [],
        projectStructure: [],
        estimatedDuration: 0,
        kpis: []
    });

    const [taskDrafts, setTaskDrafts] = useState<string[]>([]);
    const [deliverableDraft, setDeliverableDraft] = useState({ name: "", required: true });
    const [evidenceDraft, setEvidenceDraft] = useState({ name: "", required: true });
    const [structureDraft, setStructureDraft] = useState("");
    const [kpiDraft, setKpiDraft] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : name === "estimatedDuration"
                        ? Number(value)
                        : value
        }));
    };

    // --- Fases ---
    const addPhase = () => {
        setFormData((currentData) => ({
            ...currentData,
            phases: [...currentData.phases, emptyPhase(currentData.phases.length + 1)]
        }));
        setTaskDrafts((currentDrafts) => [...currentDrafts, ""]);
    };

    const removePhase = (phaseIndex: number) => {
        setFormData((currentData) => ({
            ...currentData,
            phases: currentData.phases
                .filter((_, index) => index !== phaseIndex)
                .map((phase, index) => ({ ...phase, order: index + 1 }))
        }));
        setTaskDrafts((currentDrafts) => currentDrafts.filter((_, index) => index !== phaseIndex));
    };

    const updatePhaseField = (
        phaseIndex: number,
        field: "name" | "description",
        value: string
    ) => {
        setFormData((currentData) => ({
            ...currentData,
            phases: currentData.phases.map((phase, index) =>
                index === phaseIndex ? { ...phase, [field]: value } : phase
            )
        }));
    };

    const addChecklistTask = (phaseIndex: number) => {
        const task = taskDrafts[phaseIndex]?.trim();

        if (!task) return;

        setFormData((currentData) => ({
            ...currentData,
            phases: currentData.phases.map((phase, index) =>
                index === phaseIndex
                    ? { ...phase, checklist: [...phase.checklist, task] }
                    : phase
            )
        }));

        setTaskDrafts((currentDrafts) =>
            currentDrafts.map((draft, index) => (index === phaseIndex ? "" : draft))
        );
    };

    const removeChecklistTask = (phaseIndex: number, taskIndex: number) => {
        setFormData((currentData) => ({
            ...currentData,
            phases: currentData.phases.map((phase, index) =>
                index === phaseIndex
                    ? { ...phase, checklist: phase.checklist.filter((_, ti) => ti !== taskIndex) }
                    : phase
            )
        }));
    };

    // --- Entregables ---
    const addDeliverable = () => {
        if (!deliverableDraft.name.trim()) return;

        setFormData((currentData) => ({
            ...currentData,
            deliverables: [...currentData.deliverables, deliverableDraft]
        }));

        setDeliverableDraft({ name: "", required: true });
    };

    const removeDeliverable = (index: number) => {
        setFormData((currentData) => ({
            ...currentData,
            deliverables: currentData.deliverables.filter((_, i) => i !== index)
        }));
    };

    // --- Evidencia esperada ---
    const addEvidence = () => {
        if (!evidenceDraft.name.trim()) return;

        setFormData((currentData) => ({
            ...currentData,
            expectedEvidence: [...currentData.expectedEvidence, evidenceDraft]
        }));

        setEvidenceDraft({ name: "", required: true });
    };

    const removeEvidence = (index: number) => {
        setFormData((currentData) => ({
            ...currentData,
            expectedEvidence: currentData.expectedEvidence.filter((_, i) => i !== index)
        }));
    };

    // --- Estructura del proyecto ---
    const addStructureItem = () => {
        if (!structureDraft.trim()) return;

        setFormData((currentData) => ({
            ...currentData,
            projectStructure: [...currentData.projectStructure, structureDraft.trim()]
        }));

        setStructureDraft("");
    };

    const removeStructureItem = (index: number) => {
        setFormData((currentData) => ({
            ...currentData,
            projectStructure: currentData.projectStructure.filter((_, i) => i !== index)
        }));
    };

    // --- KPIs ---
    const addKpi = () => {
        if (!kpiDraft.trim()) return;

        setFormData((currentData) => ({
            ...currentData,
            kpis: [...currentData.kpis, kpiDraft.trim()]
        }));

        setKpiDraft("");
    };

    const removeKpi = (index: number) => {
        setFormData((currentData) => ({
            ...currentData,
            kpis: currentData.kpis.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!formData.name.trim()) {
            setError("El nombre del template es requerido");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await createTemplate(formData);

            onClose();

        } catch (error) {

            console.error(error);

            setError(error instanceof Error ? error.message : "Error al crear el template");

        } finally {

            setLoading(false);

        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-[38%] max-h-[85vh] overflow-y-auto bg-[#15171c] flex flex-col p-4 gap-6"
        >
            <button onClick={onClose} type="button"><X size={14} /></button>

            <div className="flex gap-2">
                <File />
                <p>Crear un service template</p>
            </div>

            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Nombre</p>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa el nombre del template..." />
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Descripción</p>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full h-20 rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa una descripción..." />
            </div>

            <div className="w-full flex gap-3 items-center">
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Duración estimada (días)</p>
                    <input type="number" name="estimatedDuration" value={formData.estimatedDuration} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24]" />
                </div>
                <div className="w-1/2 flex gap-2 items-center pt-6">
                    <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
                    <p className="text-sm">Activo</p>
                </div>
            </div>

            {/* Fases */}
            <div className="w-full flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm">Fases</p>
                    <button type="button" onClick={addPhase} className="flex items-center gap-1 text-sm text-[#4a5fe0]">
                        <Plus size={14} /> Agregar fase
                    </button>
                </div>

                {formData.phases.map((phase, phaseIndex) => (
                    <div key={phaseIndex} className="w-full flex flex-col gap-2 bg-[#1b1e24] rounded-md p-3">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-[#9aa3b2]">Fase {phase.order}</p>
                            <button type="button" onClick={() => removePhase(phaseIndex)}>
                                <X size={12} />
                            </button>
                        </div>

                        <input type="text" value={phase.name} onChange={(e) => updatePhaseField(phaseIndex, "name", e.target.value)} placeholder="Nombre de la fase (ej. Inicio)" className="w-full rounded-md px-3 py-1 bg-[#15171c] placeholder:text-sm text-sm" />

                        <input type="text" value={phase.description} onChange={(e) => updatePhaseField(phaseIndex, "description", e.target.value)} placeholder="Descripción de la fase" className="w-full rounded-md px-3 py-1 bg-[#15171c] placeholder:text-sm text-sm" />

                        <div className="flex flex-col gap-1">
                            {phase.checklist.map((task, taskIndex) => (
                                <div key={taskIndex} className="w-full flex justify-between items-center bg-[#15171c] rounded-md px-3 py-1">
                                    <p className="text-sm">{task}</p>
                                    <button type="button" onClick={() => removeChecklistTask(phaseIndex, taskIndex)}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={taskDrafts[phaseIndex] || ""}
                                onChange={(e) =>
                                    setTaskDrafts((currentDrafts) =>
                                        currentDrafts.map((draft, index) =>
                                            index === phaseIndex ? e.target.value : draft
                                        )
                                    )
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addChecklistTask(phaseIndex);
                                    }
                                }}
                                placeholder="Agregar tarea..."
                                className="w-full rounded-md px-3 py-1 bg-[#15171c] placeholder:text-sm text-sm"
                            />
                            <button type="button" onClick={() => addChecklistTask(phaseIndex)} className="text-[#4a5fe0]">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Entregables */}
            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Entregables</p>

                <div className="flex flex-col gap-1">
                    {formData.deliverables.map((deliverable, index) => (
                        <div key={index} className="w-full flex justify-between items-center bg-[#1b1e24] rounded-md px-3 py-1">
                            <p className="text-sm">{deliverable.name} {deliverable.required && <span className="text-[#9aa3b2]">(requerido)</span>}</p>
                            <button type="button" onClick={() => removeDeliverable(index)}>
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 items-center">
                    <input type="text" value={deliverableDraft.name} onChange={(e) => setDeliverableDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Nombre del entregable..." className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm text-sm" />
                    <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                        <input type="checkbox" checked={deliverableDraft.required} onChange={(e) => setDeliverableDraft((d) => ({ ...d, required: e.target.checked }))} />
                        Requerido
                    </label>
                    <button type="button" onClick={addDeliverable} className="text-[#4a5fe0]">
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Evidencia esperada */}
            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Evidencia esperada</p>

                <div className="flex flex-col gap-1">
                    {formData.expectedEvidence.map((evidence, index) => (
                        <div key={index} className="w-full flex justify-between items-center bg-[#1b1e24] rounded-md px-3 py-1">
                            <p className="text-sm">{evidence.name} {evidence.required && <span className="text-[#9aa3b2]">(requerido)</span>}</p>
                            <button type="button" onClick={() => removeEvidence(index)}>
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 items-center">
                    <input type="text" value={evidenceDraft.name} onChange={(e) => setEvidenceDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Nombre de la evidencia..." className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm text-sm" />
                    <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                        <input type="checkbox" checked={evidenceDraft.required} onChange={(e) => setEvidenceDraft((d) => ({ ...d, required: e.target.checked }))} />
                        Requerido
                    </label>
                    <button type="button" onClick={addEvidence} className="text-[#4a5fe0]">
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Estructura del proyecto */}
            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Estructura del proyecto</p>

                <div className="flex flex-wrap gap-2">
                    {formData.projectStructure.map((item, index) => (
                        <div key={index} className="flex items-center gap-1 bg-[#1b1e24] rounded-md px-3 py-1">
                            <p className="text-sm">{item}</p>
                            <button type="button" onClick={() => removeStructureItem(index)}>
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={structureDraft}
                        onChange={(e) => setStructureDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addStructureItem();
                            }
                        }}
                        placeholder="Agregar carpeta/sección..."
                        className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm text-sm"
                    />
                    <button type="button" onClick={addStructureItem} className="text-[#4a5fe0]">
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">KPIs</p>

                <div className="flex flex-wrap gap-2">
                    {formData.kpis.map((kpi, index) => (
                        <div key={index} className="flex items-center gap-1 bg-[#1b1e24] rounded-md px-3 py-1">
                            <p className="text-sm">{kpi}</p>
                            <button type="button" onClick={() => removeKpi(index)}>
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={kpiDraft}
                        onChange={(e) => setKpiDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addKpi();
                            }
                        }}
                        placeholder="Agregar KPI..."
                        className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm text-sm"
                    />
                    <button type="button" onClick={addKpi} className="text-[#4a5fe0]">
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            <div className="flex justify-center">
                <button type="submit" disabled={loading} className="w-[45%] bg-[#5b74ff] rounded-md px-2 py-1">
                    {loading ? "Creando..." : "Crear template"}
                </button>
            </div>

        </form>
    )
}