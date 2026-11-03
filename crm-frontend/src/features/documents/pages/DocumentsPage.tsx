import { useState } from "react";
import { useParams } from "react-router-dom";

import {motion} from "framer-motion"

import DocumentsPopup from "../components/DocumentsPopup";
import CreateButton from "../../../components/ui/buttons/CreateButton"
import DocumentCard from "../components/DocumentCard"

import { useDocuments } from "../hooks/useDocuments";

export default function DocumentsPage() {

    const { companyId } = useParams();

    const { documents, loading, error, uploadDocument, deleteDocument } = useDocuments(companyId ?? null);

    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDelete = async (documentId: string) => {
        try {
            await deleteDocument(documentId);
        } catch (error) {
            console.error(error);
            setDeleteError(error instanceof Error ? error.message : "Error al eliminar el documento");
        }
    };

    return(
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full flex flex-col pb-12">
            <div className="w-full flex justify-end mt-12">
                <CreateButton title="Agregar Documento" onClick={() => setIsOpenPopup(true)}/>
            </div>

            <div className="w-full grid grid-cols-[20%_10%_20%_40%_10%] pt-12">
                <p className="text-[#9aa3b2] ">Nombre del archivo</p>
                <p className="text-[#9aa3b2] ">Tamaño</p>
                <p className="text-[#9aa3b2] ">Categoría</p>
                <p className="text-[#9aa3b2] ">Notas</p>
                <p className="text-[#9aa3b2] ">Eliminar</p>
            </div>

            {loading && (
                <p className="mt-8 text-[#9aa3b2]">Cargando documentos...</p>
            )}

            {error && (
                <p className="mt-8 text-red-400">{error}</p>
            )}

            {deleteError && (
                <p className="mt-8 text-red-400">{deleteError}</p>
            )}

            {!loading && !error && documents.length === 0 && (
                <p className="mt-8 text-[#9aa3b2]">No hay documentos registrados para esta empresa.</p>
            )}

            {!loading && !error && documents.map((document) => (
                <DocumentCard key={document._id} document={document} onDelete={handleDelete} />
            ))}

            {isOpenPopup && (
                <div
                    className="fixed inset-0  flex items-center justify-center z-50"
                    onClick={() => setIsOpenPopup(false)}
                >
                    <DocumentsPopup onClose={() => setIsOpenPopup(false)} uploadDocument={uploadDocument} />
                </div>
            )}
        </motion.div>
    )
}
