import express, { Request, Response } from "express";
import fs from "fs";

export const downloadPDFRoutes = express.Router();
downloadPDFRoutes.get("/", (req: Request, res: Response) => {
  const contents = fs.readFileSync(
    `src/generated-pdfs/skannr-image-to-pdf.pdf`,
    { encoding: "base64" }
  );
  res.send(contents);
});
