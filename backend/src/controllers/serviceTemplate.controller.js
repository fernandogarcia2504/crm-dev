import ServiceTemplate from "../models/servicetemplate.model.js"

export const createServiceTemplate = async (req, res) => {
    try {

        const { name, description, active, line, phases, deliverables, expectedEvidence, projectStructure, estimatedDuration, kpis } = req.body;

        const existingServiceTemplate = await ServiceTemplate.findOne({ name });

        if (existingServiceTemplate) {
            return res.status(409).json({ message: "El template ya existe" });
        }

        const serviceTemplate = await ServiceTemplate.create({
            name, description, active, line,
            phases, deliverables, expectedEvidence, projectStructure, estimatedDuration, kpis
        });

        return res.status(201).json({
            message: "Template creado con exito",
            serviceTemplate
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear el template" });
    }
};

export const getServiceTemplates = async (req, res) => {
    try {

        // Filtro opcional por línea: ?line=Concientización
        const { line } = req.query;
        const filter = line ? { line } : {};

        const serviceTemplates = await ServiceTemplate.find(filter).sort({ createdAt: -1 });

        return res.status(200).json({ serviceTemplates });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener los templates" });
    }
};

export const getServiceTemplate = async (req, res) => {
    try {

        const { serviceTemplateId } = req.params;

        const serviceTemplate = await ServiceTemplate.findById(serviceTemplateId);

        if (!serviceTemplate) {
            return res.status(404).json({ message: "Template no encontrado" });
        }

        return res.status(200).json({ serviceTemplate });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener el template" });
    }
};
