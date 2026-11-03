import { useState } from "react";

import { motion } from "framer-motion";

import ActivityCard from "./ActivityCard"
import CreateButton from "../../../components/ui/buttons/CreateButton"
import ActivityPopup from "../components/ActivityPopup";
import { useActivities } from "../hooks/useActivities";

import type { Opportunity } from "../../opportunities/types/opportunity.types";
import type { CreateActivityData, ProjectReference } from "../types/activities.types";

interface OpportunityActivityProps {
    opportunity: Opportunity;
    onOpportunityUpdate?: (opportunity: Opportunity) => void;
}

const formatDateTime = (value?: string) => {

    if (!value) return "Sin fecha";

    return new Date(value).toLocaleString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
};

export default function OpportunityActivity({ opportunity, onOpportunityUpdate }: OpportunityActivityProps) {

    const { activities, loading, error, createActivity } = useActivities(opportunity._id);

    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [newProject, setNewProject] = useState<ProjectReference | null>(null);

    const handleCreateActivity = async (activityData: CreateActivityData) => {

        const response = await createActivity(activityData);

        if (response.opportunity) {
            onOpportunityUpdate?.(response.opportunity);
        }

        if (response.project) {
            setNewProject(response.project);
        }

        return response;
    };

    const firstActivityDate = activities.length > 0
        ? [...activities].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )[0].date
        : null;

    return(
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col pb-12">
            <p className="px-3 pb-2">Secuencia de actividades para: {opportunity.title}</p>

            <div className="w-full flex justify-between bg-[#1b1e24] rounded-md">
                <div className="w-[60%] rounded-md flex flex-col gap-3  p-3 ">
                    <div className="flex gap-2 items-center">
                        <p className="text-sm text-[#9aa3b2] ">Etapa: </p>
                        <p className="text-sm ">{opportunity.stage}</p>
                    </div>

                    <div className="flex gap-8 items-center">
                        <p className="text-sm text-[#9aa3b2]">{activities.length} Actividades registradas</p>
                        <p className="text-sm text-[#9aa3b2]">
                            {firstActivityDate
                                ? `Acercamiento inicial ${formatDateTime(firstActivityDate)}`
                                : "Sin actividades registradas"}
                        </p>
                        <p className="text-sm text-[#9aa3b2]">
                            {opportunity.project ? "1 Proyecto asociado" : "Sin proyecto asociado"}
                        </p>
                    </div>
                </div>
                <div className="flex w-[40%] items px-6 justify-end">
                    <CreateButton title="Agregar Actividad" onClick={() => setIsOpenPopup(true)} />
                </div>
            </div>

            {newProject && (
                <div className="rounded-md bg-[#1b1e24] p-3 mt-4 mx-3">
                    <p className="text-sm text-[#9aa3b2]">
                        Se creó automáticamente el proyecto
                        <span className="text-[#e7e9ee]"> {newProject.name}</span>
                        {" "}a partir de esta oportunidad.
                    </p>
                </div>
            )}

            {loading && (
                <p className="mt-8 px-3 text-[#9aa3b2]">Cargando actividades...</p>
            )}

            {error && (
                <p className="mt-8 px-3 text-red-400">{error}</p>
            )}

            {!loading && !error && activities.length === 0 && (
                <p className="mt-8 px-3 text-[#9aa3b2]">No hay actividades registradas para esta oportunidad.</p>
            )}

            <div className="w-full flex flex-col gap-8 mt-8">
                {!loading && !error && activities.map((activity, index) => (
                    <ActivityCard
                        key={activity._id}
                        title={activity.title}
                        nextStep={activity.nextStep || "Sin próximos pasos"}
                        date={formatDateTime(activity.date)}
                        result={activity.result || "Sin resultado"}
                        type={activity.type}
                        isLast={index === activities.length - 1}
                    />
                ))}
            </div>

            {isOpenPopup && (
                <div
                    className="fixed inset-0  flex items-center justify-center z-50"
                    onClick={() => setIsOpenPopup(false)}
                >
                    <ActivityPopup createActivity={handleCreateActivity} onClose={() => setIsOpenPopup(false)} />
                </div>
            )}


        </motion.div>
    )
}