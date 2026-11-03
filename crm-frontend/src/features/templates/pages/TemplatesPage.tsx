import { useState } from "react";

import {motion} from "framer-motion";

import CreateButton from "../../../components/ui/buttons/CreateButton";
import TemplatesCard from "../components/TemplateCard";
import TemplatePopup from "../components/TemplatePopup";

import { useTemplates } from "../hooks/useTemplates";

export default function TemplatesPage() {

    const {templates, loading, error, createTemplate} = useTemplates()
    const [isOpenPopup, setIsOpenPopup] = useState(false);

    return(
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col pb-16 ">
            <div className="w-full flex justify-end mt-12">
                <CreateButton title="Agregar Template" onClick={() => setIsOpenPopup(true)} />
            </div>

            <div className="w-full grid grid-cols-3 gap-12 mt-12">

                {loading && (
                    <p className="mt-8 text-[#9aa3b2]">
                        Cargando empresas...
                    </p>
                )}


                {error && (
                    <p className="mt-8 text-red-400">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    templates?.map((serviceTemplate) => (
                        <TemplatesCard key={serviceTemplate._id} serviceTemplate={serviceTemplate} />
                    ))
                )}

            </div>

            {isOpenPopup && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    onClick={() => setIsOpenPopup(false)}
                >
                    <TemplatePopup onClose={() => setIsOpenPopup(false)} createTemplate={createTemplate} />
                </div>
            )}

        </motion.div>
    )
}