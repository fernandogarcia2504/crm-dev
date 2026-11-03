import { useState } from "react"
import { useParams } from "react-router-dom";

import { motion } from "framer-motion";

import CreateButton from "../../../components/ui/buttons/CreateButton"
import OpportunityCard from "../components/OpportunityCard";
import OpportunityPopup from "../components/OpportunityPopup";

import { useOpportunities } from "../hooks/useOpportunities";

export default function OpportunitiesPage() {

    const { companyId } = useParams();

    const { opportunities, loading, error, createOpportunity } = useOpportunities(companyId ?? null);

    const [isOpenPopup, setIsOpenPopup] = useState(false);

    return(
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col">
            <div className="w-full flex justify-end mt-12">
                <CreateButton title="Agregar Oportunidad" onClick={() => setIsOpenPopup(true)} />
            </div>

            {loading && (
                <p className="mt-8 text-[#9aa3b2]"> Cargando oportunidades...</p>
            )}

            {error && (
                <p className="mt-8 text-red-400">{error}</p>
            )}

            {!loading && !error && opportunities.length === 0 && (
                <p className="mt-8 text-[#9aa3b2]">No hay oportunidades registradas.</p>
            )}

            <div className="w-full grid grid-cols-3 gap-12 mt-12">
                {!loading && !error && opportunities.map(
                    (opportunity) => (

                        <OpportunityCard key={opportunity._id} opportunity={opportunity}/>
                    )
                )}

            </div>


            {isOpenPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setIsOpenPopup(false)} >

                    <OpportunityPopup
                        onClose={() =>
                            setIsOpenPopup(false)
                        }
                        createOpportunity={
                            createOpportunity
                        }
                    />
                </div>
            )}

        </motion.div>
    )
}
