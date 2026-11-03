import mongoose from "mongoose";

import { SERVICE_LINES } from "../config/serviceLines.js";

const companySchema = new mongoose.Schema ({

    name: {type: String, required: true},
    website: {type: String, required: true},
    companySize: {type: String, required: true},
    leadSource: {type: String},

    // Una empresa puede trabajarse en una o varias líneas de servicio.
    // Reemplaza al antiguo scoping por "negocio".
    lines: [{
        type: String,
        enum: SERVICE_LINES
    }],

    status: {
        type:String,
        enum: [
            "Prospecto",
            "Cliente",
            "Inactivo"
        ],
        default: "Prospecto"
    },

    notes: String,
    address: {
        country: String,
        state: String,
        city: String,
        pc: String,
        street: String
    }
}, {
    timestamps: true
})

export default mongoose.model("Company", companySchema);
