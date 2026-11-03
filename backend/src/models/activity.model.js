import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema ({

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },

    contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact"
    },

    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Opportunity",
        default: null
    },

    type: {
        type: String,
        enum: [
            "Correo",
            "Llamada",
            "WhatsApp",
            "LinkedIn",
            "Reunion",
            "Demo",
            "Visita",
            "Otro"
        ],
        default:"Otro"
    },

    title: String,

    description: String, //1 a n

    result: String, // agendado, completado, programado, fin, etc.

    nextStep: String,

    scheduledDate: Date,

    date: {
        type: Date,
        defualt: Date.now
    }

}, {
    timestamps: true
})

export default mongoose.model("Activity", ActivitySchema);