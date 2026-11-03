import Company from "../models/company.model.js";

export const createCompany = async (req, res) => {
    try {

        const { name, website, companySize, leadSource, status, notes, address, lines } = req.body;

        if (!name || !website || !companySize) {
            return res.status(400).json({
                message: "Nombre, sitio web y tamaño son requeridos"
            });
        }

        const existingCompany = await Company.findOne({ name });

        if (existingCompany) {
            return res.status(409).json({ message: "La empresa ya existe" });
        }

        const company = await Company.create({
            name, website, companySize, leadSource, status, notes, address,
            lines: Array.isArray(lines) ? lines : []
        });

        return res.status(201).json({
            message: "Empresa creada correctamente",
            company
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear la empresa" });
    }
};

export const getCompanies = async (req, res) => {
    try {

        // Filtro opcional por línea: ?line=Concientización
        const { line } = req.query;
        const filter = line ? { lines: line } : {};

        const companies = await Company.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({ companies });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener las empresas" });
    }
};

export const getCompany = async (req, res) => {
    try {

        const { companyId } = req.params;

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: "Empresa no encontrada" });
        }

        return res.status(200).json({ company });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener la empresa" });
    }
};

export const updateCompany = async (req, res) => {
    try {

        const { companyId } = req.params;
        const { name, website, companySize, leadSource, status, notes, address, lines } = req.body;

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({ message: "Empresa no encontrada" });
        }

        if (name) {
            const existingCompany = await Company.findOne({ name, _id: { $ne: companyId } });
            if (existingCompany) {
                return res.status(409).json({ message: "Ya existe una empresa con ese nombre" });
            }
            company.name = name;
        }

        if (website !== undefined) company.website = website;
        if (companySize !== undefined) company.companySize = companySize;
        if (leadSource !== undefined) company.leadSource = leadSource;
        if (status !== undefined) company.status = status;
        if (notes !== undefined) company.notes = notes;
        if (address !== undefined) company.address = address;
        if (lines !== undefined) company.lines = lines;

        await company.save();

        return res.status(200).json({
            message: "Empresa actualizada correctamente",
            company
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al actualizar la empresa" });
    }
};

export const deleteCompany = async (req, res) => {
    try {

        const { companyId } = req.params;

        const company = await Company.findByIdAndDelete(companyId);

        if (!company) {
            return res.status(404).json({ message: "Empresa no encontrada" });
        }

        return res.status(200).json({ message: "Empresa eliminada correctamente" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar la empresa" });
    }
};
