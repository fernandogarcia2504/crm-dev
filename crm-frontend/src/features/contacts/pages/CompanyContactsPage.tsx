import { useState } from "react"

import {motion} from "framer-motion"

import CreateButton from "../../../components/ui/buttons/CreateButton"
import ContactPopup from "../components/CompanyContactPopup"
import CompanyContactCard from "../components/CompanyContactCard"

import { useContacts } from "../hooks/useContacts"
import { useParams } from "react-router-dom"

import type { Contact } from "../types/contact.types"

export default function CompanyContactsPage() {

    const {companyId} = useParams();

    const {contacts, loading, error, createContact, updateContact, deleteContact} = useContacts(companyId ?? null);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

    const handleOpenCreate = () => {
        setEditingContact(null);
        setIsOpenPopup(true);
    };

    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
        setIsOpenPopup(true);
    };

    const handleClosePopup = () => {
        setIsOpenPopup(false);
        setEditingContact(null);
    };

    const handleDelete = async (contactId: string) => {
        if (!window.confirm("¿Eliminar este contacto? Esta acción no se puede deshacer.")) return;
        await deleteContact(contactId);
    };

    return(
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col">
            <div className="w-full flex justify-end mt-12">
                <CreateButton title="Agregar Contacto" onClick={handleOpenCreate} />
            </div>

            <div className="w-full grid grid-cols-[18%_18%_18%_26%_10%_10%] pt-8">
                <p className="text-[#959595]">Nombre</p>
                <p className="text-[#959595]">Puesto</p>
                <p className="text-[#959595]">Teléfono</p>
                <p className="text-[#959595]">Correo electrónico</p>
                <p className="text-[#959595] text-right">Principal</p>
                <p className="text-[#959595] text-right">Acciones</p>
            </div>

            {loading && (
                <p className="mt-8 text-[#959595]">
                    Cargando contactos...
                </p>
            )}


            {error && (
                <p className="mt-8 text-red-400">
                    {error}
                </p>
            )}

            {!loading && !error && contacts.map((contact) => (
                    <CompanyContactCard
                        key={contact._id}
                        contact={contact}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))
            }

            {isOpenPopup && (
                <div
                    className="fixed inset-0  flex items-center justify-center z-50"
                    onClick={handleClosePopup}
                >
                        <ContactPopup
                            onClose={handleClosePopup}
                            createContact={createContact}
                            updateContact={updateContact}
                            contact={editingContact}
                        />
                </div>
            )}
        </motion.div>
    )
}