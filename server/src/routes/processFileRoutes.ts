import express from "express";
import { processFileController } from "../controllers/processFileController";

export const processFileRoutes = express.Router();
processFileRoutes.post("/", processFileController);
