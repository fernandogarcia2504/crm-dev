import {motion} from "framer-motion"
import { LoaderCircle, Banknote } from 'lucide-react';

import type { Opportunity } from "../types/opportunity.types";

interface OpportunityCardProps {
    opportunity: Opportunity;
}

export default function OpportunityCard({opportunity}: OpportunityCardProps) {

    const formattedDate =
        opportunity.expectedStartDate
            ? new Date(
                opportunity.expectedStartDate
            ).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric"
            })
            : "Sin fecha";

    return(
        <motion.button 
            className="bg-[#15171c] rounded-md shadow-lg px-4 py-4 cursor-pointer"
            whileHover={{ y: -6, scale: 1.02}}
            whileTap={{ scale: 0.98}}
            transition={{ type: "spring", stiffness: 300, damping: 20}}>
                
            <p className="text-start">{opportunity.title}</p>
            <div className="border-b border-b-[#2a2f38]"></div>
            <div className="flex justify-between pt-2">
                <div className="flex gap-1 items-center">
                    <LoaderCircle size={15} />
                    <p className="text-sm text-[#9aa3b2]">{opportunity.stage}</p>

                </div>
                <p className="text-sm text-[#9aa3b2]">{opportunity.probability}% Probabilidad</p>
            </div>
            <div className="rounded-2xl w-full bg-slate-300 h-1 mt-2">
                <div className="rounded-2xl h-full bg-[#5b74ff]"
                    style={{
                        width: `${opportunity.probability}%`
                    }}
                />
            </div>
            <div className="flex gap-1 items-center mt-2">
                <Banknote size={15} />
                <p className="text-sm text-[#9aa3b2]">Fecha de inicio</p>
            </div>
            <p className="text-sm mt-2 text-start">{formattedDate}</p>
        </motion.button>
    )
}