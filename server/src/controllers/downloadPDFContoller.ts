import { Request, Response } from "express";
import fs from "fs";

export const downloadPDFContoller = (req: Request, res: Response) => {
  const contents = fs.readFileSync(
    `${__dirname}/generated-pdfs/skannr-image-to-pdf.pdf`,
    { encoding: "base64" }
  );
  res.send(contents);
};
