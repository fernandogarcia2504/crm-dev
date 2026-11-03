import { motion } from "framer-motion";

interface SetAvailableMoneyProps {
    amount: number;
}

export default function AvailableMoneyCard({amount}: SetAvailableMoneyProps) {

    return(
        <motion.div
            whileHover={{ backgroundColor: "#1b1e24" }}
            transition={{ duration: 0.2 }}
            className=" flex flex-col w-[30%] bg-[#15171c] mt-8 px-3 py-2 gap-3 rounded-md shadow-lg"
        >
            <p className="text-sm font-bold">Dinero disponible</p>
            
            <p className="text-sm">${amount}</p>

            <p className="text-sm text-[#9aa3b2]">En la cuenta bancaria</p>

        </motion.div>
    )
}