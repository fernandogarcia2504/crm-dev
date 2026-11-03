import Activity from "../models/activity.model.js";
import Opportunity from "../models/opportunity.model.js";
import ServiceTemplate from "../models/servicetemplate.model.js"
import Project from "../models/project.model.js"

export const createActivity = async (req, res) => {

    try {

        const { opportunityId } = req.params;

        const {
            type,
            title,
            description,
            date,
            result,
            nextStep,
            scheduledDate,
            opportunityUpdates
        } = req.body;

        const opportunity = await Opportunity.findById(opportunityId);

        if (!opportunity) {

            return res.status(404).json({
                message: "La oportunidad no existe"
            });

        }

        if (!type || !title) {

            return res.status(400).json({
                message: "El tipo y titulo de la actividad son requeridos"
            });

        }

        const activity = await Activity.create({
            opportunity: opportunity._id,
            company: opportunity.company,
            contact: opportunity.contact,
            type,
            title,
            description,
            date,
            result,
            nextStep,
            scheduledDate
        });

        if (opportunityUpdates) {

            const {
                stage,
                probability,
                estimatedAmount,
                estimatedCloseDate,
                expectedStartDate,
                priority,
                lostReason,
                nextAction,
                nextActionDate,
                notes
            } = opportunityUpdates;


            if (stage !== undefined) {
                opportunity.stage = stage;
            }

            if (probability !== undefined) {
                opportunity.probability = probability;
            }

            if (estimatedAmount !== undefined) {
                opportunity.estimatedAmount = estimatedAmount;
            }

            if (estimatedCloseDate !== undefined) {
                opportunity.estimatedCloseDate = estimatedCloseDate;
            }

            if (expectedStartDate !== undefined) {
                opportunity.expectedStartDate = expectedStartDate;
            }

            if (priority !== undefined) {
                opportunity.priority = priority;
            }

            if (lostReason !== undefined) {
                opportunity.lostReason = lostReason;
            }

            if (nextAction !== undefined) {
                opportunity.nextAction = nextAction;
            }

            if (nextActionDate !== undefined) {
                opportunity.nextActionDate = nextActionDate;
            }

            if (notes !== undefined) {
                opportunity.notes = notes;
            }

        }

        opportunity.lastActivityAt = date || new Date();

        let project = null;

        if(opportunity.stage === "Ganado" && !opportunity.project) {

            // La plantilla de servicio es opcional; si existe, se copian
            // sus entregables al proyecto comercial.
            const serviceTemplate = opportunity.serviceTemplate
                ? await ServiceTemplate.findById(opportunity.serviceTemplate)
                : null;

            project = await Project.create({

                // Datos provenientes de Opportunity
                line: opportunity.line,

                company: opportunity.company,

                opportunity: opportunity._id,

                serviceTemplate: opportunity.serviceTemplate,

                name: opportunity.title,

                startDate: opportunity.expectedStartDate,

                // Project comienza en Planeacion
                status: "Planeacion",

                // El scope tecnico, los assets y las fases/checklist de
                // ejecucion NO se crean aqui: esa operacion vive en
                // atalaya-platform, que sembrara su registro de ejecucion
                // a partir del ServiceTemplate usando este projectId.

                // Copiar deliverables del ServiceTemplate (compromiso comercial)
                deliverables: (serviceTemplate?.deliverables || []).map(
                    deliverable => ({

                        name: deliverable.name,

                        completed: false,

                        version: 1,

                        deliveredAt: null

                    })
                ),

                // Timeline comienza vacío
                timeline: []
            });

            opportunity.project = project._id
        }


        await opportunity.save();


        return res.status(201).json({

            message: "Actividad creada exitosamente",

            activity,

            opportunity,

            project

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al crear la actividad"
        });

    }

};

export const getOpportunityActivities = async (req, res) => {

    try {

        const { opportunityId } = req.params;


        const opportunity = await Opportunity.findById(opportunityId);

        if (!opportunity) {

            return res.status(404).json({
                message: "La oportunidad no existe"
            });

        }


        const activities = await Activity
            .find({
                opportunity: opportunityId
            })
            .populate("contact", "fullName position")
            .sort({ date: -1 });


        return res.status(200).json({

            activities

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener las actividades"
        });

    }

};

export const getActivity = async (req, res) => {

    try {

        const { activityId } = req.params;


        const activity = await Activity
            .findById(activityId)
            .populate("opportunity", "title stage")
            .populate("company", "name")
            .populate("contact", "fullName position");


        if (!activity) {

            return res.status(404).json({
                message: "La actividad no existe"
            });

        }


        return res.status(200).json({

            activity

        });


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener la actividad"
        });

    }

};


// GET TODAS LAS ACTIVIDADES (cross-empresa) — dashboard y próximas.
// Filtro opcional: ?upcoming=1 (solo con scheduledDate en el futuro)
export const getAllActivities = async (req, res) => {

    try {

        const { upcoming } = req.query;

        const filter = {};
        if (upcoming) {
            filter.scheduledDate = { $gte: new Date() };
        }

        const activities = await Activity
            .find(filter)
            .populate("company", "name")
            .populate("contact", "fullName")
            .populate("opportunity", "title")
            .sort(upcoming ? { scheduledDate: 1 } : { date: -1 })
            .limit(200);

        return res.status(200).json({ activities });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al obtener las actividades"
        });

    }

};