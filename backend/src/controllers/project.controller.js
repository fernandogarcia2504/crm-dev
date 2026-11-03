import Company from "../models/company.model.js";
import Project from "../models/project.model.js";

// El proyecto en el CRM es un registro COMERCIAL (gestion). El avance se
// deriva de los entregables (lo que se vendio/comprometio), no de la
// ejecucion tecnica: esa -- scope, assets, fases y checklist -- vive en
// atalaya-platform, ligada por projectId.
const calculateProgress = (project) => {

    const deliverables = project.deliverables || [];

    if (!deliverables.length) {
        return 0;
    }

    const completed = deliverables.filter(
        (deliverable) => deliverable.completed
    ).length;

    return Math.round((completed / deliverables.length) * 100);
};

const serializeProject = (project) => ({
    ...project.toObject(),
    progress: calculateProgress(project)
});


// GET TODOS LOS PROYECTOS DE UNA EMPRESA
export const getProjects = async (req, res) => {

    try {

        const { companyId } = req.params;

        const company = await Company.findById(companyId);

        if (!company) {

            return res.status(404).json({
                message: "El cliente no existe"
            });

        }

        const projects = await Project
            .find({ company: companyId })
            .populate("serviceTemplate", "name")
            .populate("opportunity", "title")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            projects: projects.map(serializeProject)

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener los proyectos"
        });

    }

};


// GET UN PROYECTO
export const getProject = async (req, res) => {

    try {

        const { projectId } = req.params;

        const project = await Project
            .findById(projectId)
            .populate("company", "name")
            .populate("serviceTemplate", "name description")
            .populate("opportunity", "title stage");

        if (!project) {

            return res.status(404).json({
                message: "El proyecto no existe"
            });

        }

        return res.status(200).json({

            project: serializeProject(project)

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener el proyecto"
        });

    }

};
