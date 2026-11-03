import { useState } from "react"
import {motion} from "framer-motion"

import CreateButton from "../../../components/ui/buttons/CreateButton"
import ContactCard from "../components/ContactCard"
import ContactPopup from "../components/ContactPopup"

import { useAllContacts } from "../hooks/useAllContacts"
import { useCompanies } from "../../companies/hooks/useCompanies"

export default function ContactsPage() {

    const {contacts, loading, error, createContact} = useAllContacts();
    const { companies, loading: loadingCompanies} = useCompanies()
    const [isOpenPopup, setIsOpenPopup] = useState(false);

    return(
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col">
            <div className="w-full flex justify-end mt-12">
                <CreateButton title="Agregar Contacto" onClick={() => setIsOpenPopup(true)} />
            </div>

            <div className="w-full grid grid-cols-[20%_20%_15%_15%_20%_10%] pt-8">
                <p className="text-[#9aa3b2]">Nombre</p>
                <p className="text-[#9aa3b2]">Puesto</p>
                <p className="text-[#9aa3b2]">Teléfono</p>
                <p className="text-[#9aa3b2]">Empresa</p>
                <p className="text-[#9aa3b2]">Correo electrónico</p>
                <p className="text-[#9aa3b2] text-right">Principal</p>
            </div>

            {loading && (
                <p className="mt-8 text-[#9aa3b2]">
                    Cargando contactos...
                </p>
            )}


            {error && (
                <p className="mt-8 text-red-400">
                    {error}
                </p>
            )}

            {!loading && !error && contacts.map((contact) => (
                    <ContactCard
                        key={contact._id}
                        contact={contact}
                    />
                ))
            }

            {isOpenPopup && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    onClick={() => setIsOpenPopup(false)}
                >
                    <ContactPopup
                        onClose={() => setIsOpenPopup(false)}
                        companies={companies}
                        createContact={createContact}
                        loadingCompanies={loadingCompanies}
                    />
                </div>
            )}
        </motion.div>
    )
}