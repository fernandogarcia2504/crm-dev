import { useState } from "react";

import { Check, X } from "lucide-react";

import type { CreateActivityData } from "../types/activities.types";

interface ActivityPopupProps {
    onClose: () => void;

    createActivity: (
        activityData: CreateActivityData
    ) => Promise<unknown>;
}

export default function ActivityPopup({ onClose, createActivity}: ActivityPopupProps) {

    const [formData, setFormData] = useState<CreateActivityData>({ type: "Otro", title: "", description: "", result: "", nextStep: "", scheduledDate: "", date: ""});

    const [stage, setStage] = useState<
        | "Descubrimiento"
        | "Propuesta"
        | "Negociacion"
        | "Contrato"
        | "Ganado"
        | "Perdido"
        | ""
    >("");

    const [probability, setProbability] = useState("");
    const [nextAction, setNextAction] = useState("");
    const [nextActionDate, setNextActionDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent< HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {

        const { name, value } = e.target;
        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));
    };


    const handleSubmit = async ( e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const activityData: CreateActivityData = {
                ...formData,

                opportunityUpdates:
                    stage ||
                    probability ||
                    nextAction ||
                    nextActionDate
                        ? {
                            ...(stage && { stage }),

                            ...(probability !== "" && {
                                probability: Number(probability)
                            }),

                            ...(nextAction && {
                                nextAction
                            }),

                            ...(nextActionDate && {
                                nextActionDate
                            })
                        }
                        : undefined
            };

            await createActivity(activityData);
            onClose();

        } catch (error) {

            console.error(error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Error al crear la actividad"
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="w-[40%] max-h-[90vh] overflow-y-auto bg-[#15171c] flex flex-col p-4 gap-6">

            <button type="button" onClick={onClose}><X size={14} /></button>
            <div className="flex gap-2 items-center">
                <Check />
                <p>Agregar una actividad</p>
            </div>

            {error && (
                <p className="text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Tipo</p>
                <select name="type" value={formData.type} onChange={handleChange} required className="w-full rounded-md px-3 py-2 bg-[#1b1e24] text-[#e7e9ee]">
                    <option value="Correo">Correo</option>
                    <option value="Llamada">Llamada</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Reunion">Reunión</option>
                    <option value="Demo">Demo</option>
                    <option value="Visita">Visita</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Título</p>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md px-3 py-2 bg-[#1b1e24] placeholder:text-sm"
                    placeholder="Ingresa el título de la actividad..."
                />
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Nota</p>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full h-24 rounded-md px-3 py-2 bg-[#1b1e24] placeholder:text-sm resize-none"
                    placeholder="Ingresa una nota..."
                />
            </div>

            <div className="w-full flex flex-col gap-3">

                <p className="text-sm">
                    Próximos pasos
                </p>

                <textarea
                    name="nextStep"
                    value={formData.nextStep}
                    onChange={handleChange}
                    className="w-full h-24 rounded-md px-3 py-2 bg-[#1b1e24] placeholder:text-sm resize-none"
                    placeholder="Ingresa los próximos pasos a realizar..."
                />

            </div>


            {/* Resultado */}

            <div className="w-full flex flex-col gap-3">

                <p className="text-sm">
                    Resultado
                </p>

                <input
                    type="text"
                    name="result"
                    value={formData.result}
                    onChange={handleChange}
                    className="w-full rounded-md px-3 py-2 bg-[#1b1e24] placeholder:text-sm"
                    placeholder="¿Cuál fue el resultado de la actividad?"
                />

            </div>


            {/* Fechas */}

            <div className="w-full flex gap-3">

                <div className="w-1/2 flex flex-col gap-3">

                    <p className="text-sm">
                        Fecha agendada
                    </p>

                    <input
                        type="datetime-local"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleChange}
                        className="w-full rounded-md px-3 py-2 bg-[#1b1e24]"
                    />

                </div>


                <div className="w-1/2 flex flex-col gap-3">

                    <p className="text-sm">
                        Fecha de actividad
                    </p>

                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full rounded-md px-3 py-2 bg-[#1b1e24]"
                    />

                </div>

            </div>


            {/* Separador */}

            <div className="border-b border-[#2f343e]" />


            {/* Actualizar oportunidad */}

            <div className="flex flex-col gap-4">

                <p className="text-sm font-medium">
                    Actualizar oportunidad
                </p>


                {/* Etapa */}

                <div className="w-full flex flex-col gap-3">

                    <p className="text-sm text-[#9aa3b2]">
                        Nueva etapa
                    </p>

                    <select
                        value={stage}
                        onChange={(e) =>
                            setStage(
                                e.target.value as typeof stage
                            )
                        }
                        className="w-full rounded-md px-3 py-2 bg-[#1b1e24] text-[#e7e9ee]"
                    >

                        <option value="">
                            No cambiar
                        </option>

                        <option value="Descubrimiento">
                            Descubrimiento
                        </option>

                        <option value="Propuesta">
                            Propuesta
                        </option>

                        <option value="Negociacion">
                            Negociación
                        </option>

                        <option value="Contrato">
                            Contrato
                        </option>

                        <option value="Ganado">
                            Ganado
                        </option>

                        <option value="Perdido">
                            Perdido
                        </option>

                    </select>

                </div>


                {/* Probabilidad */}

                <div className="w-full flex flex-col gap-3">

                    <p className="text-sm text-[#9aa3b2]">
                        Probabilidad
                    </p>

                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={probability}
                        onChange={(e) =>
                            setProbability(e.target.value)
                        }
                        className="w-full rounded-md px-3 py-2 bg-[#1b1e24]"
                        placeholder="Ej. 75"
                    />

                </div>


                {/* Próxima acción */}

                <div className="w-full flex flex-col gap-3">

                    <p className="text-sm text-[#9aa3b2]">
                        Próxima acción
                    </p>

                    <input
                        type="text"
                        value={nextAction}
                        onChange={(e) =>
                            setNextAction(e.target.value)
                        }
                        className="w-full rounded-md px-3 py-2 bg-[#1b1e24] placeholder:text-sm"
                        placeholder="Ingresa la próxima acción..."
                    />

                </div>


                {/* Fecha próxima acción */}

                <div className="w-full flex flex-col gap-3">

                    <p className="text-sm text-[#9aa3b2]">
                        Fecha de próxima acción
                    </p>

                    <input
                        type="datetime-local"
                        value={nextActionDate}
                        onChange={(e) =>
                            setNextActionDate(e.target.value)
                        }
                        className="w-full rounded-md px-3 py-2 bg-[#1b1e24]"
                    />

                </div>

            </div>


            {/* Aviso cuando se gana */}

            {stage === "Ganado" && (

                <div className="rounded-md bg-[#1b1e24] p-3">

                    <p className="text-sm text-[#9aa3b2]">
                        Al marcar la oportunidad como
                        <span className="text-[#e7e9ee]">
                            {" "}Ganado
                        </span>
                        , el backend creará automáticamente
                        el Project asociado.

                    </p>

                </div>

            )}


            {/* Submit */}

            <div className="flex justify-center">

                <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 bg-[#5b74ff] rounded-md px-2 py-2 disabled:opacity-50"
                >

                    {loading
                        ? "Creando..."
                        : "Crear actividad"
                    }

                </button>

            </div>

        </form>
    );
}