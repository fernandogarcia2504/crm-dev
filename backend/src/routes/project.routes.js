import express from "express";

import { getProjects, getProject } from "../controllers/project.controller.js";

const router = express.Router();

router.get("/:companyId", getProjects);

router.get("/:companyId/:projectId", getProject);

export default router;
