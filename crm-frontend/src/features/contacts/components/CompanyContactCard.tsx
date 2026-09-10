import { motion } from "framer-motion";

import { Pencil, Trash } from "lucide-react";

import type { Contact } from "../types/contact.types";

interface ContactCardProps {
    contact: Contact;
    onEdit: (contact: Contact) => void;
    onDelete: (contactId: string) => void;
}

export default function CompanyContactCard({contact, onEdit, onDelete}: ContactCardProps) {

    return(
        <motion.div
            whileHover={{ backgroundColor: "#242424" }}
            transition={{ duration: 0.2 }}
            className="w-full grid grid-cols-[18%_18%_18%_26%_10%_10%] mt-8 py-2 rounded-md items-center"
        >
            <motion.p whileHover={{ x: 2 }} className="">{contact.fullName}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{contact.position}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{contact.phone}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="">{contact.email}</motion.p>
            <motion.p whileHover={{ x: 2 }} className="text-right">{contact.isPrimary ? "Sí" : "No"}</motion.p>

            <div className="flex justify-end gap-3">
                <button type="button" onClick={() => onEdit(contact)} className="cursor-pointer">
                    <Pencil size={16} color="#959595" />
                </button>
                <button type="button" onClick={() => onDelete(contact._id)} className="cursor-pointer">
                    <Trash size={16} color="red" />
                </button>
            </div>
        </motion.div>
    )
}