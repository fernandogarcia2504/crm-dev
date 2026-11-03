import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

// CRM usa CRM_PORT (default 3000) para no chocar con la plataforma, que
// usa PORT (4000). Así un mismo .env compartido funciona para ambos.
// El frontend del CRM apunta a http://localhost:3000.
const PORT = process.env.CRM_PORT || 3000;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB conectado");

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Error conectando a MongoDB:", error);
        process.exit(1);
    }
};

startServer();