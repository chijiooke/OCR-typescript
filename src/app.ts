import express from "express";
import fs from "fs";
import multer from "multer";
import * as Tesseract from "tesseract.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

const worker = Tesseract.createWorker();
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
    fs.readFile(`./file_uploads/${req.file?.originalname}`, (err, data) => {
      if (err) return console.log("error message");

      Tesseract.recognize(data, "eng", { tessjs_create_pdf: "1" }).then(result=> res.send(result.data.text)).finally(()=>worker.);
    })
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on port: ${PORT}`));

process.on("uncaughtException", (err) => {
  console.error(err, "Uncaught Exception thrown");
  process.exit(1);
});
