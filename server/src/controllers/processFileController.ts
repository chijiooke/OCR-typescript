import { Request, Response } from "express";
import multer from "multer";
import Tesseract from "tesseract.js";
import fs from "fs";

// upload and process files
const processFile = multer().single("avatar");

export const processFileController = async (req: Request, res: Response) => {
  // if bad image or invalid image data
  if (!req.body.base64IMG || req.body.base64IMG === "") {
    return res
      .status(400)
      .json({ status: 400, message: "Invalid image or image data" });
  }

  // image buffer
  const buffer = Buffer.from(req.body.base64IMG, "base64");

  // read image using tessaract worker
  processFile(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ status: 400, message: "Image processing failed" });
    }

    // res.send("okay")
    (async () => {
      const worker = await Tesseract.createWorker();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text, pdf },
      } = await worker.recognize(buffer, { pdfTitle: "Test" }, { pdf: true });

      // create pdf, store file on local disk and send response with pdf URl and image text
      fs.writeFileSync(
        `src/generated-pdfs/skannr-image-to-pdf.pdf`,
        Buffer.from(pdf as any)
      );

      res.send({
        text,
        PDF_URL: `src/generated-pdfs/skannr-image-to-pdf.pdf`,
      });
      await worker.terminate();
    })();
  });
};
