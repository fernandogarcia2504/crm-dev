import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({

    company:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Company"
    },

    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },

    category:{
        type:String,
        enum:[
            "Contrato",
            "NDA",
            "Cotizacion",
            "Reporte Ejecutivo",
            "Reporte Tecnico",
            "Presentacion",
            "Factura",
            "Evidencia",
            "Otro"
        ],
        default:"Otro"
    },

    fileName:String,

    originalName:String,

    mimeType:String,

    size:Number,

    version:{
        type:Number,
        default:1
    },

    s3Key:{
        type:String,
        required:true
    },

    s3Bucket:{
        type:String,
        required:true
    },

    notes:String

},{
    timestamps:true
})

export default mongoose.model("Document", DocumentSchema);