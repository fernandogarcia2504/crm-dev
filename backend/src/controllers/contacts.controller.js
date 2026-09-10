import Contact from "../models/contact.model.js"
import Company from "../models/company.model.js"

export const createContact = async(req, res) => {
    try {

        const {companyId} = req.params;

        const {fullName, position, email, phone, linkedin, isPrimary, notes} = req.body

        const existingContact = await Contact.findOne({ email })

        if (existingContact) {
            return res.status(409).json({ message:"El contacto ya existe"})
        }

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "La empresa no existe"
            });
        }

        const contact = await Contact.create({
            company: companyId,
            fullName,
            position,
            email,
            phone,
            linkedin,
            isPrimary,
            notes
        })

        return res.status(201).json({
            message: "Contacto creado exitosamente",
            contact: {
                id: contact._id,
                company: contact.company,
                fullName: contact.fullName,
                position: contact.position,
                email: contact.email,
                phone: contact.phone,
                linkedin: contact.linkedin,
                isPrimary: contact.isPrimary,
                notes: contact.notes
            }
        })
    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al crear el contacto"
        });
    }
}

export const getContacts = async (req, res) => {
    try {

        const { companyId } = req.params;

        const company = await Company.findById(companyId)

        if (!company) {
            return res.status(404).json({
                message: "La empresa no existe"
            });
        }

        const contacts = await Contact.find({
            company: companyId
        }).populate("company", "name");

        return res.status(200).json({
            contacts
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener los contactos"
        });
    }
};


export const getContact = async (req, res) => {
    try {

        const { companyId, contactId } = req.params;

        const contact = await Contact.findOne({
            _id: contactId,
            company: companyId
        });

        if (!contact) {
            return res.status(404).json({
                message: "Contacto no encontrado"
            });
        }

        return res.status(200).json({
            contact
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener el contacto"
        });
    }
};


export const updateContact = async (req, res) => {
    try {

        const { companyId, contactId } = req.params;

        const {
            fullName,
            position,
            email,
            phone,
            linkedin,
            isPrimary,
            notes
        } = req.body;

        const contact = await Contact.findOne({
            _id: contactId,
            company: companyId
        });

        if (!contact) {
            return res.status(404).json({
                message: "Contacto no encontrado"
            });
        }

        if (email !== undefined && email !== contact.email) {

            const existingContact = await Contact.findOne({
                company: companyId,
                email,
                _id: { $ne: contactId }
            });

            if (existingContact) {
                return res.status(409).json({
                    message: "Ya existe otro contacto con este email en la empresa"
                });
            }
        }

        if (fullName !== undefined) {
            contact.fullName = fullName;
        }

        if (position !== undefined) {
            contact.position = position;
        }

        if (email !== undefined) {
            contact.email = email;
        }

        if (phone !== undefined) {
            contact.phone = phone;
        }

        if (linkedin !== undefined) {
            contact.linkedin = linkedin;
        }

        if (isPrimary !== undefined) {
            contact.isPrimary = isPrimary;
        }

        if (notes !== undefined) {
            contact.notes = notes;
        }

        await contact.save();

        return res.status(200).json({
            message: "Contacto actualizado correctamente",
            contact
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al actualizar el contacto"
        });
    }
};


export const deleteContact = async (req, res) => {
    try {

        const { companyId, contactId } = req.params;

        const contact = await Contact.findOne({
            _id: contactId,
            company: companyId
        });

        if (!contact) {
            return res.status(404).json({
                message: "Contacto no encontrado"
            });
        }

        await Contact.findByIdAndDelete(contactId);

        return res.status(200).json({
            message: "Contacto eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al eliminar el contacto"
        });
    }
};
 
export const getAllContacts = async (req, res) => {
    try {

        const { businessId } = req.query;

        if (!businessId) {
            return res.status(400).json({
                message: "El businessId es requerido"
            });
        }

        const companies = await Company.find({ business: businessId }).select("_id");

        const companyIds = companies.map((company) => company._id);

        const contacts = await Contact.find({
            company: { $in: companyIds }
        }).populate("company", "name");

        return res.status(200).json({
            contacts
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener los contactos"
        });
    }
};