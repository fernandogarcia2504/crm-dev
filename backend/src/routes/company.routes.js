import express from "express";

import { createCompany, getCompanies, getCompany, deleteCompany, updateCompany } from "../controllers/company.controller.js";

const router = express.Router();

router.post("/", createCompany);

router.get("/", getCompanies);

router.get("/:companyId", getCompany);

router.put("/:companyId", updateCompany);

router.delete("/:companyId", deleteCompany);

export default router;
