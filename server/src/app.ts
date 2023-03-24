import express from "express";
import fs from "fs";
import multer from "multer";
import * as Tesseract from "tesseract.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

// const worker = Tesseract.createWorker();
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "file_uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
 
const uploadFile = multer({ storage: storage }).single("avatar");
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  uploadFile(req, res, (err) => {
    fs.readFile(`./file_uploads/${req.file?.originalname}`, (err, filedata) => {
      if (err) return console.log("error message");

      
      (async () => {
        const worker = await Tesseract.createWorker();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const {
          data: { text, pdf },
        } = await worker.recognize(
          filedata,
          { pdfTitle: "Example PDF" },
          { pdf: true }
        );
        console.log(text, pdf);
        fs.writeFileSync(`${__dirname}/pdfs/tesseract-ocr-result.pdf`, Buffer.from(pdf as any));
        // res.send(text);
        res.redirect("./download");
        await worker.terminate();
      })();
    });
  });
});

app.get("/download", (req, res) => {
  const file = `${__dirname}/pdfs/tesseract-ocr-result.pdf`;
  res.download(file);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));

process.on("uncaughtException", (err) => {
  console.error(err, "Uncaught Exception thrown");
  process.exit(1);
});



// import express, { Request, Response } from "express";
// import fs from "fs";
// import multer from "multer";
// import * as Tesseract from "tesseract.js";
// import * as dotenv from "dotenv";
// import cors from "cors";
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json({limit: '50mb'}));
// // app.use(express.urlencoded({limit: '50mb'}));


// var corsOptions = {
//   origin: "http://example.com",
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// // const worker = Tesseract.createWorker();
// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "file_uploads/");
//   },
//   filename: (req, file, callback) => {
//     callback(null, file.originalname);
//   },
// });

// const uploadFile = multer({ storage: storage }).single("avatar");

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });
 
// app.post("/api/process-file", (req: Request, res: Response) => {
//   console.log("fileName:", req.body.fileName);
//   const buffer = Buffer.from(req.body.base64IMG, "base64");
//   fs.writeFileSync(`file_uploads/${req.body.fileName}`, buffer);
//   uploadFile(req, res, (err) => {
//     fs.readFile(`file_uploads/${req.body.fileName}`, (err, filedata) => {
//       if (err) return console.log("error message");
 
//       (async () => {
//         const worker = await Tesseract.createWorker();
//         await worker.loadLanguage("eng");
//         await worker.initialize("eng");
//         const {
//           data: { text },
//         } = await worker.recognize(filedata);
//         res.send(text);
//         await worker.terminate();
//       })();
//     });
//   });
// });


// // const PORT = process.env.PORT || 8080;
// const PORT = 8080;
// app.listen(PORT, () => console.log(`listening on port: ${PORT}`));

// process.on("uncaughtException", (err) => {
//   console.error(err, "Uncaught Exception thrown");
//   process.exit(1);
// });
