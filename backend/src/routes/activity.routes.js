import express from "express";

import {
    createActivity,
    getActivity,
    getOpportunityActivities,
    getAllActivities
} from "../controllers/activity.controller.js";

const router = express.Router();

// Global (cross-empresa) — dashboard y próximas actividades
router.get("/", getAllActivities);

// Por oportunidad
router.post("/:opportunityId", createActivity);
router.get("/:opportunityId", getOpportunityActivities);
router.get("/:opportunityId/:activityId", getActivity);

export default router;
