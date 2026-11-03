import { motion } from "framer-motion";

interface SetProcessCardProps {
    quantity: number;
}

export default function ProcessCard({quantity}: SetProcessCardProps) {

    return(
        <motion.div
            whileHover={{ backgroundColor: "#1b1e24" }}
            transition={{ duration: 0.2 }}
            className=" flex flex-col w-[30%] bg-[#15171c] mt-8 px-3 py-2 gap-3 rounded-md shadow-lg"
        >
            <p className="text-sm font-bold">Proceso hasta llegar al millon</p>
            <div className="flex items-center gap-2">
                <p className="text-sm">${quantity}</p>
                <p className="font-bold">/$1,000,000</p>   
            </div>

            <div className="rounded-2xl w-full bg-slate-300 h-1 mt-2">
                <div className="rounded-2xl w-[46%] h-full bg-[#5b74ff] "></div>
            </div>

            <p className="text-[#9aa3b2] text-sm">Faltan $518,000 para la meta anual</p>

        </motion.div>
    )
}