import type { Contact, CreateContactData, UpdateContactData, GetContactResponse, GetContactsResponse, UpdateContactResponse, CreateContactResponse, GetAllContactsResponse } from "../types/contact.types";

const API_URL = "http://localhost:3000/api/contacts";

export const getAllContacts = async(businessId: string): Promise<Contact[]> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/?businessId=${businessId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok) {
        throw new Error (
            "Error al obtener todos los contactos de todas las empresas"
        )
    }

    const data: GetAllContactsResponse = await response.json()

    return data.contacts
}

export const getContacts = async(companyId: string): Promise<Contact[]> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if(!response.ok) {
        throw new Error (
            "Error al obtener todos los contactos de todas las empresas"
        )
    }

    const data: GetContactsResponse = await response.json()

    return data.contacts
}

export const getContact = async (contactId: string, companyId: string): Promise<Contact> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}/contacts/${contactId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error(
            "Error al obtener la empresa"
        );
    }

    const data: GetContactResponse = await response.json();

    return data.contact;

}

export const createContact = async (companyId: string, contactData: CreateContactData): Promise<Contact> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify(contactData)
    })

    const data: CreateContactResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al crear la empresa"
        );
    }

    return data.contact;
}

export const updateContact = async (companyId: string, contactId: string, contactData: UpdateContactData ): Promise<Contact> => {

    const token = localStorage.getItem("token");

    const response = await fetch( `${API_URL}/${companyId}/contacts/${contactId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(contactData)
        }
    );

    const data: UpdateContactResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Error al actualizar la empresa"
        );
    }

    return data.contact;
};

export const deleteContact = async (companyId: string, contactId: string): Promise<void> => {

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${companyId}/contacts/${contactId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {

        const data = await response.json().catch(() => ({}));

        throw new Error(
            data.message || "Error al eliminar el contacto"
        );
    }
};