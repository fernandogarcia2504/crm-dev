import express from "express";

import {
    createOpportunity,
    getOpportunities,
    getOpportunity,
    updateOpportunity,
    getAllOpportunities,
    updateOpportunityStage
} from "../controllers/opportunity.controller.js";

const router = express.Router();

// Globales (cross-empresa) — pipeline y dashboard
router.get("/", getAllOpportunities);
router.patch("/:opportunityId/stage", updateOpportunityStage);

// Por empresa
router.post("/:companyId", createOpportunity);
router.get("/:companyId", getOpportunities);
router.get("/:companyId/:opportunityId", getOpportunity);
router.put("/:companyId/:opportunityId", updateOpportunity);

export default router;
