import { motion } from "framer-motion";

interface SetPendingAdvanceCardProps {
    pendingAdvance: number;
}

export default function PendingAdvanceCard({pendingAdvance}: SetPendingAdvanceCardProps) {

    return(
        <motion.div
            whileHover={{ backgroundColor: "#1b1e24" }}
            transition={{ duration: 0.2 }}
            className=" flex flex-col w-[20%] bg-[#15171c] mt-8 px-3 py-2 gap-3 rounded-md shadow-lg"
        >
            <p className="text-sm font-bold">Anticipos pendientes</p>

            <p>${pendingAdvance}</p>

            <p className="text-sm text-[#9aa3b2]">3 proyectos</p>
        </motion.div>
    )
}