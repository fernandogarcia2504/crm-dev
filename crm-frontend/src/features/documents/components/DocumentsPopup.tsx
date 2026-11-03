import { useRef, useState } from "react";

import { X, FileUp } from 'lucide-react';

import type { UploadDocumentData} from "../services/documentService";
import type { DocumentCategory } from "../types/documents.types";

interface DocumentsPopupProps {
    onClose: () => void;

    uploadDocument: (
        documentData: UploadDocumentData
    ) => Promise<unknown>;
}

const CATEGORIES: DocumentCategory[] = [
    "Contrato",
    "NDA",
    "Cotizacion",
    "Reporte Ejecutivo",
    "Reporte Tecnico",
    "Presentacion",
    "Factura",
    "Evidencia",
    "Otro"
];

export default function DocumentsPopup({ onClose, uploadDocument }: DocumentsPopupProps) {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState<DocumentCategory>("Otro");
    const [notes, setNotes] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files?.[0];

        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!file) {
            setError("Selecciona un archivo para subir");
            return;
        }

        try {

            setLoading(true);
            setError(null);

            await uploadDocument({ file, category, notes });

            onClose();

        } catch (error) {

            console.error(error);

            setError(error instanceof Error ? error.message : "Error al subir el documento");

        } finally {

            setLoading(false);

        }
    };

    return(
        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="w-[27%] bg-[#15171c]  flex flex-col p-4 gap-6">

            <button type="button" onClick={onClose}> <X size={14} /></button>

            <div className="flex gap-2">
                <FileUp />
                <p>Agregar un documento</p>
            </div>

            {error && (
                <p className="text-sm text-red-400">
                    {error}
                </p>
            )}

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Categoría</p>
                <select value={category} onChange={(e) => setCategory(e.target.value as DocumentCategory)} className="w-full rounded-md px-3 py-2 bg-[#1b1e24] text-[#e7e9ee]">
                    {CATEGORIES.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="w-full flex flex-col gap-3">
                <p className="text-sm">Nota</p>
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-md px-3 py-1 bg-[#1b1e24] placeholder:text-sm" placeholder="Ingresa una nota..." />
            </div>

            <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
            />

            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`w-full flex flex-col items-center justify-center rounded-md bg-[#1b1e24] border border-dashed py-8 cursor-pointer transition-colors ${isDragging ? "border-[#5b74ff]" : "border-gray-500"}`}
            >
                <FileUp />

                {file ? (
                    <p className="text-[#e7e9ee] mt-2">{file.name}</p>
                ) : (
                    <>
                        <p className='text-[#9aa3b2] mt-2'>Arrastra y suelta</p>
                        <p className='text-[#9aa3b2]'>o</p>
                        <p className='text-[#5b74ff]'>Explorar archivos</p>
                    </>
                )}
            </div>

            <div className="flex justify-center">
                <button type="submit" disabled={loading} className="w-1/3 bg-[#5b74ff] hover:bg-[#5b74ff] hover:shadow-lg hover:border-[#2f343e] rounded-md px-2 py-1 transition duration-300">
                    {loading ? "Subiendo..." : "Subir archivo"}
                </button>
            </div>
        </form>
    )
}