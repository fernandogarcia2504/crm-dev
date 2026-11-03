import mongoose from "mongoose";

import { SERVICE_LINES } from "../config/serviceLines.js";

const OpportunitySchema = new mongoose.Schema ({

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },

    // Línea de servicio a la que pertenece la oportunidad.
    line: {
        type: String,
        enum: SERVICE_LINES
    },

    serviceTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceTemplate"
    },

    title: String,

    stage: {
        type: String,
        enum: [
            "Descubrimiento",
            "Propuesta",
            "Negociacion",
            "Contrato",
            "Ganado",
            "Perdido"
        ],
        default: "Descubrimiento"
    },

    estimatedAmount: Number,

    probability: Number,

    estimatedCloseDate: Date,

    expectedStartDate: Date,

    priority: {
        type: String,
        enum:[
            "Baja",
            "Media",
            "Alta"
        ],
        default:"Media"
    },

    lostReason: String,

    nextAction: String,

    notes: String,

    nextActionDate: Date,

    lastActivityAt: Date,

    project: {
        type: mongoose.Schema.Types.ObjectId,        
        ref: "Project",
        default: null
    }
    
}, {
    timestamps: true
})

export default mongoose.model("Opportunity", OpportunitySchema);