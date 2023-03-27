import cors from "cors";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { processFileController } from "./controllers/processFileController";
import { downloadPDFRoutes } from "./routes/downloadPDFRoutes";
import { processFileRoutes } from "./routes/processFileRoutes";

dotenv.config();

const app = express();
app.use(cors());

// file size limit to manage overload
app.use(express.json({ limit: "50mb" }));


// app.use('/static', express.static(path.join(__dirname, 'views')))

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, welcome to skannr OCR. A simple Image to text/PDF tool");
});

// single api route to manage processed file POST requests
app.use("/api/process-file", processFileRoutes);

// single api route to manage pdf download GET requests
app.use("/api/pdf-download", downloadPDFRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT);

process.on("uncaughtException", (err) => {
  process.exit(1);
});

