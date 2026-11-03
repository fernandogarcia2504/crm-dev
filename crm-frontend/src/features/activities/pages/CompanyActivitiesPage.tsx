import { useParams } from "react-router-dom";

import { motion } from "framer-motion";

import OpportunityActivity from "../components/OpportunityActivity";

import { useOpportunities } from "../../opportunities/hooks/useOpportunities";

export default function CompanyActivitiesPage() {

    const { companyId } = useParams();

    const { opportunities, loading, error, syncOpportunity } = useOpportunities(companyId ?? null);

    return(
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col pb-12">

            {loading && (
                <p className="mt-12 text-[#9aa3b2]">Cargando actividades...</p>
            )}

            {error && (
                <p className="mt-12 text-red-400">{error}</p>
            )}

            {!loading && !error && opportunities.length === 0 && (
                <p className="mt-12 text-[#9aa3b2]">No hay oportunidades registradas para esta empresa.</p>
            )}

            <div className="w-full flex flex-col gap-10 mt-12">
                {!loading && !error && opportunities.map((opportunity) => (
                    <div key={opportunity._id} className="w-full flex flex-col rounded-lg shadow-lg bg-[#15171c] px-4 py-5">
                        <OpportunityActivity
                            opportunity={opportunity}
                            onOpportunityUpdate={syncOpportunity}
                        />
                    </div>
                ))}
            </div>

        </motion.div>
    )
}
