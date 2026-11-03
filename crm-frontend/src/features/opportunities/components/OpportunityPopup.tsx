import { useState } from "react";

import { X, Target } from "lucide-react";

import type { CreateOpportunityData, ServiceLine } from "../types/opportunity.types";
import { useTemplates } from "../../templates/hooks/useTemplates";

const SERVICE_LINES: ServiceLine[] = ["Exposición", "Concientización", "Investigación y DD", "Riesgos"];

interface OpportunityPopupProps {
    onClose: () => void;

    createOpportunity: (
        opportunityData: CreateOpportunityData
    ) => Promise<unknown>;
}

export default function OpportunityPopup({onClose, createOpportunity}: OpportunityPopupProps) {

    const { templates, loading: loadingTemplates } = useTemplates();

    const [formData, setFormData] =
        useState<CreateOpportunityData>({
            line: undefined,
            serviceTemplateId: "",
            title: "",
            stage: "Descubrimiento",
            estimatedAmount: 0,
            probability: 0,
            estimatedCloseDate: "",
            expectedStartDate: "",
            priority: "Media",
            lostReason: "",
            nextAction: "",
            notes: ""
        });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = ( e: React.ChangeEvent< HTMLInputElement | HTMLSelectElement >
    ) => {
        const { name, value } = e.target;

        setFormData((currentData) => ({

            ...currentData,

            [name]:
                name === "estimatedAmount" ||
                name === "probability"
                    ? Number(value)
                    : value

        }));
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (!formData.line) {
            setError("Selecciona una línea de servicio");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await createOpportunity(formData);

            onClose();

        } catch (error) {
            console.error(error);
            setError( error instanceof Error ? error.message : "Error al crear la oportunidad");

        } finally {
            setLoading(false);

        }
    };


    return(
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="w-[27%] bg-[#15171c] flex flex-col p-4 gap-6">

            <button onClick={onClose} type="button"> <X size={14} /></button>

            <div className="flex gap-2">
                <Target />
                <p>Agregar nueva oportunidad</p>
            </div>

            {error && (

                <p className="text-sm text-red-400">
                    {error}
                </p>

            )}

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Línea de servicio</p>
                <select name="line" value={formData.line ?? ""} onChange={handleChange} required className="w-full rounded-md px-3 py-2 bg-[#1b1e24] text-[#e7e9ee]">
                    <option value="">Selecciona una línea</option>
                    {SERVICE_LINES.map((line) => (
                        <option key={line} value={line}>{line}</option>
                    ))}
                </select>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Servicio (opcional)</p>
                <select name="serviceTemplateId" value={formData.serviceTemplateId} onChange={handleChange} disabled={loadingTemplates} className="w-full rounded-md px-3 py-2 bg-[#1b1e24] text-[#e7e9ee]">
                    <option value="">
                        {loadingTemplates
                            ? "Cargando servicios..."
                            : "Sin plantilla"}
                    </option>

                    {templates.map((template) => (
                        <option key={template._id} value={template._id} > {template.name}</option>
                    ))}
                </select>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Titulo de la oportunidad</p>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa el nombre de la oportunidad"  />
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm"> Etapa </p>

                <select name="stage" value={formData.stage} onChange={handleChange} className="w-full rounded-md px-3 py-2 bg-[#1b1e24] text-[#e7e9ee]" >

                    <option value="Descubrimiento"> Descubrimiento </option>
                    <option value="Propuesta"> Propuesta </option>
                    <option value="Negociacion"> Negociación</option>
                    <option value="Contrato"> Contrato</option>
                    <option value="Ganado">Ganado</option>
                    <option value="Perdido">Perdido</option>
                </select>
            </div>        

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Prioridad</p>
                <select name="priority" value={formData.priority} onChange={handleChange} className="w-full rounded-md px-3 py-2 bg-[#1b1e24] text-[#e7e9ee]">
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                </select>
            </div>

            <div className="w-full flex gap-3">
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Fecha tentativa inicio</p>
                    <input type="date" name="expectedStartDate" value={formData.expectedStartDate} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" />
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Fecha tentativa cierre</p>
                    <input type="date" name="estimatedCloseDate" value={formData.estimatedCloseDate} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" />
                </div>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Notas</p>
                <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa notas a considerar..." />
            </div>

            <div className="w-full flex gap-3">
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Cantidad estimada</p>
                    <input type="number" name="estimatedAmount" value={formData.estimatedAmount} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" />
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Probabilidad</p>
                    <input type="number" name="probability" value={formData.probability} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" />
                </div>
            </div>

            <div className="flex justify-center">
                <button type="submit" disabled={loading} className="w-[45%] bg-[#5b74ff] rounded-md px-2 py-1">{loading ? "Creando...":"Crear oportunidad"}</button>
            </div>

        </form>
    )
}