// =====================================================================
// Reset de datos para el CRM unificado (sin "negocio")
// ---------------------------------------------------------------------
// Al quitar el modelo Business, los documentos viejos quedan con un campo
// `business` que ya no aplica, y la colección `businesses` queda huérfana.
// Este script limpia eso. Dos modos:
//
//   node src/scripts/reset-unificado.js business
//     -> Borra la colección `businesses` y quita el campo `business` de
//        empresas, oportunidades, proyectos, actividades, documentos y
//        plantillas. CONSERVA el resto de tus datos.
//
//   node src/scripts/reset-unificado.js wipe
//     -> Borra TODO el contenido comercial (empresas, contactos,
//        oportunidades, proyectos, actividades, documentos, plantillas,
//        negocios). NO toca los usuarios. Para empezar de cero.
//
// Requiere MONGO_URI en el .env. Haz respaldo antes de correrlo.
// =====================================================================
import "dotenv/config";
import mongoose from "mongoose";

const mode = process.argv[2];

if (!["business", "wipe"].includes(mode)) {
    console.log("Uso: node src/scripts/reset-unificado.js <business|wipe>");
    console.log("  business  limpia solo el campo/colección de negocio (conserva datos)");
    console.log("  wipe      borra todo el contenido comercial (deja usuarios)");
    process.exit(1);
}

const COMERCIAL = [
    "companies",
    "contacts",
    "opportunities",
    "projects",
    "activities",
    "documents",
    "servicetemplates"
];

const run = async () => {

    if (!process.env.MONGO_URI) {
        console.error("Falta MONGO_URI en el .env");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    const existing = (await db.listCollections().toArray()).map((c) => c.name);

    if (mode === "wipe") {

        for (const name of [...COMERCIAL, "businesses"]) {
            if (existing.includes(name)) {
                const count = await db.collection(name).countDocuments();
                await db.collection(name).deleteMany({});
                console.log(`wipe  ${name}: ${count} documento(s) borrado(s)`);
            }
        }
        console.log("Listo. Usuarios intactos; el resto quedó vacío.");

    } else {

        // business
        if (existing.includes("businesses")) {
            await db.collection("businesses").drop();
            console.log("drop  businesses (colección eliminada)");
        }

        for (const name of COMERCIAL) {
            if (existing.includes(name)) {
                const res = await db.collection(name).updateMany(
                    { business: { $exists: true } },
                    { $unset: { business: "" } }
                );
                console.log(`clean ${name}: campo business quitado de ${res.modifiedCount} documento(s)`);
            }
        }
        console.log("Listo. Datos conservados, sin referencias a negocio.");

    }

    await mongoose.disconnect();
    process.exit(0);
};

run().catch((error) => {
    console.error("Error en el reset:", error.message);
    process.exit(1);
});
