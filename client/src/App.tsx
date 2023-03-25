import { useState } from "react";
import "./App.css";
import heroImage from "./assets/hero3.png";
import { CloseSquare, DocumentText, Image, Scan, Windows } from "iconsax-react";
import axios from "axios";

function App() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [ImageData, setImageData] = useState<{
    text: string;
    PDF_URL: string;
    pdf: BlobPart[];
  } | null>();
  const [imageBase64String, setImageBase64String] = useState<string[]>([]);
  const dragging = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const cancelDragging = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const isInputActive = () => {
    if (isDragging || !!imageBase64String.length) return true;
  };

  const getBase64 = (myFile: File) => {
    var reader = new FileReader();
    reader.readAsDataURL(myFile);
    reader.onload = function () {
      reader.result &&
        setImageBase64String(reader.result?.toString().split(","));
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const handleChange = (file: File) => {
    if (file) getBase64(file);
  };

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
        })
        .catch((err) => {});
    } catch (err) {
    } finally {
      setisLoading(false);
    }
  };

  const download = async () => {
    try {
      await axios
        .get(`http://localhost:8080/api/pdf-download`)
        .then((res) => {
          //  console.log(res.data)
          //  const url = window.URL.createObjectURL(
          //           new Blob(res.data, {
          //             type: "application/pdf",
          //           })
          //         );

          // const linkSource = `data:application/pdf;base64,${res}`;
          // const downloadLink = document.createElement("a");
          // const fileName = "abc.pdf";
          // downloadLink.href = linkSource;
          // downloadLink.download = fileName;
          // downloadLink.click();
          // console.log(res)

          const link = document.createElement("a");
          link.href = `data:application/pdf;base64,${res.data}`;

          console.log(link.href);
          link.setAttribute("download", "skanner.pdf");
          link.rel = "noreferrer";
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
        })
        .catch((err) => {});
    } catch (err) {
    } finally {
    }
  };

  return (
    <div className="app">
      {ImageData && (
        <div className="image__text__modal__wrapper">
          <div className="image__text__modal">
            <CloseSquare
              size="32"
              style={{ alignSelf: "end", display: "flex" }}
              onClick={() => {
                setImageData(null);
              }}
            />
            <p>{ImageData.text}</p>
            <button
              onClick={() => {
                download();
              }}
            >
              Download PDF
            </button>
          </div>
        </div>
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
            <CloseSquare
              size="32"
              className="remove__file__btn"
              onClick={() => {
                setIsDragging(false);
                setImageBase64String([]);
              }}
            />
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? `Reading text...` : "Convert"}
            {isLoading && <Scan size="32" className="scan__loader" />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
