import mongoose from "mongoose";

import { SERVICE_LINES } from "../config/serviceLines.js";

const ProjectSchema = new mongoose.Schema ({

    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Company"
    },

    // Línea de servicio del proyecto (hereda de la oportunidad).
    line: {
        type: String,
        enum: SERVICE_LINES
    },

    opportunity:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Opportunity"
    },

    serviceTemplate:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"ServiceTemplate"
    },

    name: String,

    status:{
        type:String,
        enum:[
            "Planeacion",
            "Ejecucion",
            "Cierre",
            "Cerrado"
        ],
        default:"Planeacion"
    },

    manager: String,

    startDate: Date,

    dueDate: Date,

    deliveryDate: Date,

    // NOTA DE ARQUITECTURA (separacion CRM / atalaya-platform)
    // ------------------------------------------------------------------
    // Lo OPERATIVO del proyecto -- scope tecnico (dominios, subdominios,
    // ips, aplicaciones, apis, exclusiones, ventanas), inventario de
    // assets y las fases/checklist de ejecucion -- se movio a
    // atalaya-platform, donde cada linea de negocio corre su propia
    // operacion. Alla el registro de ejecucion referencia este proyecto
    // por su _id (projectId). El CRM conserva el proyecto SOLO como
    // registro comercial de la gestion: estado, responsable, fechas,
    // entregables y bitacora.
    deliverables:[{

        name:String,

        completed:Boolean,

        version:Number,

        deliveredAt:Date

    }],

    timeline:[{

        title:String,

        description:String,

        user:String,

        createdAt:Date

    }]
}, {
    timestamps: true
})

export default mongoose.model("Project", ProjectSchema);