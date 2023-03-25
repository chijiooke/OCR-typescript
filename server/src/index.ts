import express, { Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import * as Tesseract from "tesseract.js";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

// file size limit to manage overload
app.use(express.json({ limit: "50mb" }));

// upload and process files
const processFile = multer().single("avatar");

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, welcome to skannr OCR. A simple Image to text/PDF tool");
});

// api to manage processed file POST requests
app.post("/api/process-file", (req: Request, res: Response) => {
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

    (async () => {
      const worker = await Tesseract.createWorker();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text, pdf },
      } = await worker.recognize(buffer, { pdfTitle: "Test" }, { pdf: true });

      // create pdf, store file on local disk and send response with pdf URl and image text
      fs.writeFileSync(
        `${__dirname}/pdfs/skannr-image-to-pdf.pdf`,
        Buffer.from(pdf as any)
      );

      // fs.readFile(
      //   `${__dirname}/pdfs/skannr-image-to-pdf.pdf`,
      //   (err, data) => {console.log(data)}
      // );

      console.log(pdf);

      res.send({
        text,
        PDF_URL: `${__dirname}/pdfs/skannr-image-to-pdf.pdf`,
        pdf,
      });
      await worker.terminate();
    })();
    // return;
  });
});

app.get("/api/pdf-download", (req: Request, res: Response) => {
  const contents = fs.readFileSync(
    `${__dirname}/pdfs/skannr-image-to-pdf.pdf`,
    { encoding: "base64" }
  );
  res.send(contents);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);

process.on("uncaughtException", (err) => {
  process.exit(1);
});
