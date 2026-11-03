import express from "express";

import { createServiceTemplate, getServiceTemplate, getServiceTemplates } from "../controllers/serviceTemplate.controller.js";

const router = express.Router();

router.post("/", createServiceTemplate);

router.get("/", getServiceTemplates);

router.get("/:serviceTemplateId", getServiceTemplate);

export default router;
