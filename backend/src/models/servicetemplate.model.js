import mongoose from "mongoose";

import { SERVICE_LINES } from "../config/serviceLines.js";

const ServiceTemplateSchema = new mongoose.Schema ({

    // Línea de servicio a la que aplica esta plantilla (opcional).
    line: {
        type: String,
        enum: SERVICE_LINES
    },

    name: String,
    description: String,
    active: Boolean,

    phases: [{
        name: String,
        order: Number,
        description: String,
        checklist: [String]
    }],

    deliverables:[{

        name:String,

        required:Boolean

    }],

    expectedEvidence:[{

        name:String,

        required:Boolean

    }],

    projectStructure: [String],

    estimatedDuration: Number,

    kpis: [String]
}, {
    timestamps: true
})

export default mongoose.model("ServiceTemplate", ServiceTemplateSchema);