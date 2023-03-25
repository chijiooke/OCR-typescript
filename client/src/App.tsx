import axios from "axios";
import { CloseSquare, DocumentText, Image, Scan } from "iconsax-react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import heroImage from "./assets/hero3.png";
import { Modal } from "./components/modal/Modal";
import { errorMessage, successMessage } from "./utils/toast";

function App() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [ImageData, setImageData] = useState<{
    text: string;
    PDF_URL: string;
    pdf: BlobPart[];
  } | null>();
  const [imageBase64String, setImageBase64String] = useState<string[]>([]);
 



  

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setisLoading(true);

    try {
      await axios
        .post(`http://localhost:8080/api/process-file`, {
          fileName: imageBase64String[0],
          base64IMG: imageBase64String[1],
        })
        .then((res) => {
          setisLoading(false);
          setImageData(res.data);
          setIsModalOpen(true);
        })
        .catch((err) =>
          errorMessage("error reading text from image, try again")
        );
    } catch (err) {
    } finally {
      setisLoading(false);
    }
  };



  const downloadPDF = async () => {
    try {
      await axios
        .get(`http://localhost:8080/api/pdf-download`)
        .then((res) => {
          const link = document.createElement("a");
          link.href = `data:application/pdf;base64,${res.data}`;
          console.log(link.href);
          link.setAttribute("download", "skanner.pdf");
          link.rel = "noreferrer";
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => errorMessage("pdf download failed, try again"));
    } catch (err) {
    } finally {
    }
  };

  return (
    <div className="app">
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          downloadPDF={downloadPDF}
         
          imageDataText={ImageData?.text || ""}
        />
      )}
      <div className="hero__section">
        <img src={heroImage} className="hero__image" />
        <h1 className="hero__title">
          SKANN<span style={{ color: "red" }}>Я</span>.ocr
        </h1>
        <p className="hero__subtext">
          A simple <b>image to text/pdf </b>
          tool built with typescript and node.js
        </p>
        <div className="hero__value__props__wrapper">
          <p className="hero__value_props">
            <Scan size="32" />
            Extract text off of images
          </p>
          <p className="hero__value_props">
            <DocumentText size="32" />
            Convert images to PDFs
          </p>
        </div>
      </div>
      <div className="file__input__section">
        <form
          className="form"
          onSubmit={(e) => onSubmit(e)}
          encType="multipart/form-data"
        >
          {imageBase64String.length && (
            <button
              className="remove__file__btn"
              onClick={() => {
                setIsDragging(false);
                setImageBase64String([]);
                setImageData(null);
              }}
            >
              Remove Image <CloseSquare size="32" />
            </button>
          )}
          <label
            htmlFor="file-upload"
            className="custom__file__upload__label"
            style={{
              opacity: isInputActive() ? 0.5 : 1,
              backgroundColor: isInputActive() ? "#fdfdfd14" : "transparent",
              backgroundImage: imageBase64String.length
                ? `url(${imageBase64String.join()})`
                : "",
              backgroundSize: "cover",
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const dt = e.dataTransfer;
              handleChange(dt.files && dt.files[0]);
            }}
            onDragOver={(e) => {
              dragging(e);
            }}
            onDragEnter={(e) => {
              cancelDragging(e);
            }}
            onDragLeave={(e) => {
              cancelDragging(e);
            }}
            onDragEnd={(e) => {
              cancelDragging(e);
            }}
            onDragEndCapture={(e) => {
              cancelDragging(e);
            }}
          >
            {isLoading ? (
              <Scan size="100" className="scan__loader" />
            ) : (
              <Image size="32" color="#FF8A65" />
            )}{" "}
            <br></br>
            {!imageBase64String.length && "Browse or Drop File Here"}
          </label>
          <input
            name="file"
            hidden
            type="file"
            placeholder="drop file"
            className="input"
            id="file-upload"
            onChange={(e) => {
              if (e.target.files?.length) {
                handleChange(e.target.files[0]);
              }
            }}
            disabled={isLoading}
          />
          {!!ImageData && (
            <button onClick={() => setIsModalOpen(true)}>
              View Image Text
            </button>
          )}
          <button
            type="submit"
            disabled={!imageBase64String || isLoading || !!ImageData}
          >
            {isLoading ? `Reading text...` : "Convert"}
            {isLoading && <Scan size="32" className="scan__loader" />}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
