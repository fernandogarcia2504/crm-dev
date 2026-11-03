import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import companyRoutes from "./routes/company.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import opportunityRoutes from "./routes/opportunity.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import serviceTemplateRoutes from "./routes/serviceTemplate.routes.js"
import projectRoutes from "./routes/project.routes.js"
import documentRoutes from "./routes/document.routes.js"

import { verifyToken } from "./middlewares/auth.middleware.js";

const app = express();

const allowedOrigins = [
    process.env.CRM_ORIGIN || "http://localhost:5173"
];

// En desarrollo cualquier localhost sirve (Vite puede moverse de puerto).
// En producción se usan los orígenes explícitos de allowedOrigins.
const isLocalhost = (origin) =>
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

app.use(cors({
    origin: (origin, callback) => {

        // Sin origin = server-to-server / curl / Postman, se dejan pasar
        if (!origin || isLocalhost(origin) || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        callback(new Error("Origen no permitido por CORS"));

    }
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

// --- CRM: un solo espacio, solo gestion comercial ---
// Ya no hay "negocio/emprendimiento": la linea de servicio es una
// etiqueta (lines) sobre empresa, oportunidad y proyecto. La OPERACION
// por linea vive en atalaya-platform, ligada por companyId / projectId.
app.use("/api/companies", verifyToken, companyRoutes);
app.use("/api/contacts", verifyToken, contactRoutes);
app.use("/api/opportunities", verifyToken, opportunityRoutes);
app.use("/api/activities", verifyToken, activityRoutes);
app.use("/api/service-templates", verifyToken, serviceTemplateRoutes);
app.use("/api/projects", verifyToken, projectRoutes);
app.use("/api/documents", verifyToken, documentRoutes);

export default app;
