import { useEffect, useState } from "react";

import {
    getAllContacts,
    createContact as createContactService
} from "../services/contactService";

import type {
    Contact,
    CreateContactData
} from "../types/contact.types";


export function useAllContacts() {

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {

        const fetchContacts = async () => {

            try {

                setLoading(true);
                setError(null);

                setContacts(await getAllContacts());

            } catch (error) {

                console.error(error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Error al obtener los contactos"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchContacts();

    }, []);


    const createContact = async (
        companyId: string,
        contactData: CreateContactData
    ) => {

        const newContact = await createContactService(
            companyId,
            contactData
        );

        setContacts((currentContacts) => [
            ...currentContacts,
            newContact
        ]);

        return newContact;
    };


    return {
        contacts,
        loading,
        error,
        createContact
    };
}
