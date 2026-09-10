import { useState } from "react";

import { Phone, X } from "lucide-react";

import type { Contact, CreateContactData, UpdateContactData } from "../types/contact.types";

interface ContactPopupsProps {
    onClose: () => void;

    contact?: Contact | null;

    createContact: (contactData: CreateContactData) => Promise<unknown>;
    updateContact?: (contactId: string, contactData: UpdateContactData) => Promise<unknown>;
}

const emptyFormData: CreateContactData = {
    fullName: "",
    position: "",
    email: "",
    phone: "",
    linkedin: "",
    notes: "",
    isPrimary: false
};

export default function CompanyContactPopup({onClose, contact, createContact, updateContact}: ContactPopupsProps) {

    const isEditing = Boolean(contact);

    const [formData, setFormData] = useState<CreateContactData>(
        contact
            ? {
                fullName: contact.fullName,
                position: contact.position,
                email: contact.email,
                phone: contact.phone,
                linkedin: contact.linkedin ?? "",
                notes: contact.notes ?? "",
                isPrimary: contact.isPrimary ?? false
            }
            : emptyFormData
    )

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = e.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {

            setLoading(true);
            setError(null);

            if (isEditing && contact && updateContact) {
                await updateContact(contact._id, formData);
            } else {
                await createContact(formData);
            }

            onClose();

        } catch (error) {

            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : `Error al ${isEditing ? "actualizar" : "crear"} el contacto`
            );

        } finally {

            setLoading(false);

        }
    }

    return(
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="w-[27%] bg-[#1A1A1A] flex flex-col p-4 gap-6">

            <button type="button" onClick={onClose}> <X size={14} /></button>

            <div className="flex gap-2">
                <Phone />
                <p>{isEditing ? "Editar contacto" : "Agregar nuevo contacto"}</p>
            </div>

            {error && (
                <p className="text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Nombre completo del contacto</p>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el nombre del contacto..." />
            </div>

            <div className="w-full flex gap-3">
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Puesto en la empresa</p>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el puesto del contacto..." />
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Número de teléfono</p>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el teléfono del contacto..." />
                </div>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Correo electrónico</p>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el correo electrónico del contacto..." />
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">LinkedIn</p>
                <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa el link de LinkedIn..." />
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Notas</p>
                <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#212121] placeholder:text-sm" placeholder="Ingresa notas sobre el contacto..." />
            </div>

            <div className="flex gap-3 items-center">
                <input
                    type="checkbox"
                    name="isPrimary"
                    checked={formData.isPrimary}
                    onChange={handleChange}
                    className="w-4 h-4 rounded cursor-pointer accent-[#2F76D2] [color-scheme:light]"
                />
                <p className="text-sm">Es el contacto principal de la empresa</p>
            </div>

            <div className="flex justify-center">
                <button type="submit" disabled={loading} className="w-1/3 bg-[#2F76D2] rounded-md px-2 py-1 disabled:opacity-50">
                    {loading ? (isEditing ? "Guardando..." : "Creando...") : (isEditing ? "Guardar cambios" : "Crear contacto")}
                </button>
            </div>
        </form>
    )
}