import {motion} from "framer-motion"

import { File, Trash } from "lucide-react";

import type { CompanyDocument } from "../types/documents.types";

interface DocumentCardProps {
    document: CompanyDocument;
    onDelete: (documentId: string) => void;
}

const formatSize = (bytes: number) => {

    if (!bytes) return "0 KB";

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
        return `${mb.toFixed(1)} MB`;
    }

    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

export default function DocumentCard({document, onDelete}: DocumentCardProps) {

    return(
        <motion.div 
            whileHover={{ backgroundColor: "#1b1e24" }}
            transition={{ duration: 0.2 }}
            className="w-full grid grid-cols-[20%_10%_20%_40%_10%] mt-8 py-2">

            <a href={document.url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <File color="blue" />
                <p className="hover:underline">{document.originalName}</p>
            </a>

            <p>{formatSize(document.size)}</p>
            <p>{document.category}</p>
            <p>{document.notes || "-"}</p>
            
            <button type="button" onClick={() => onDelete(document._id)} className="text-right cursor-pointer"><Trash color="red" /></button>
        </motion.div>
    )
}
