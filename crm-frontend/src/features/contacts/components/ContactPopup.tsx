import { useState } from "react";

import { Phone, X } from "lucide-react";

import type { CreateContactData } from "../types/contact.types";
import type { Company } from "../../companies/types/company.types";

interface ContactPopupsProps {
    onClose: () => void;

    companies: Company[];

    loadingCompanies: boolean;

    createContact: (
        companyId: string,
        contactData: CreateContactData
    ) => Promise<unknown>;
}

export default function ContactPopup({onClose, createContact, companies, loadingCompanies}: ContactPopupsProps) {
    
    const [formData, setFormData] = useState<CreateContactData> ({
        fullName: "",
        position: "",
        email: "",
        phone: "",
        linkedin: "",
        notes: ""
    })
    
    const [selectedCompanyId, setSelectedCompanyId] = useState("");

    const [, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        if (!selectedCompanyId) {
            setError("Selecciona una empresa");
            return;
        }

        try {

            setLoading(true);
            setError(null);

            await createContact( selectedCompanyId,formData);

            onClose();

        } catch (error) {

            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Error al crear la empresa"
            );

        } finally {

            setLoading(false);

        }
    }
    
    return(
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="w-[27%] bg-[#15171c] flex flex-col p-4 gap-6">

            <button type="button" onClick={onClose}> <X size={14} /></button>

            <div className="flex gap-2">
                <Phone />
                <p>Agregar nuevo contacto</p>
            </div>

            {error && (
                <p className="text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Selecciona una empresa</p>
                <select value={selectedCompanyId} onChange={(e) => setSelectedCompanyId(e.target.value)} disabled={loadingCompanies} required
                    className="w-full rounded-md px-3 py-2 bg-[#1b1e24] text-[#e7e9ee] placeholder:text-sm" >
                    <option value=""> {loadingCompanies ? "Cargando empresas..." : "Selecciona una empresa" } </option>

                    {companies.map((company) => (
                        <option
                            key={company._id}
                            value={company._id}
                        >
                            {company.name}
                        </option>
                    ))}
                </select>            
            </div>
            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Nombre completo del contacto</p>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa el nombre del contacto..." />
            </div>

            <div className="w-full flex gap-3">
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Puesto en la empresa</p>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa el puesto del contacto..." />
                </div>
                <div className="w-1/2 flex flex-col gap-3">
                    <p className="text-sm">Número de teléfono</p>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa el teléfono del contacto..." />
                </div>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Correo electrónico</p>
                <input type="text" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa el correo electrónico del contacto..." />
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">LinkedIn</p>
                <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa el link de LinkedIn..." />
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Notas</p>
                <input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa el notas sobre el contacto..." />
            </div>

            <div className="flex gap-3">
                <div></div>
                <p className="text-sm">Es el contacto principal de la empresa</p>
            </div>

            <div className="flex justify-center">
                <button className="w-[40%] bg-[#5b74ff] rounded-md px-2 py-1">Crear contacto</button>
            </div>
        </form>
    )
}