import { useState } from "react";
import "./App.css";
import heroImage from "./assets/hero3.png";
import { CloseSquare, Image } from "iconsax-react";
import axios from "axios";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [processedString, setprocessedString] = useState<string[]>([]);
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
    if (isDragging || !!file) return true;
  };

  const getBase64 = (myFile: File) => {
    var reader = new FileReader();
    reader.readAsDataURL(myFile);
    reader.onload = function () {
      reader.result && setprocessedString(reader.result?.toString().split(","));
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setisLoading(true);

    console.log(file);
    if (file) getBase64(file);
    console.log(processedString);

    try {
      await axios
        .post(`http://localhost:8080/api/process-file`, {
          base64IMG: processedString[1],
          fileName: file?.name,
        })
        .then((res) => {
          setisLoading(false);
          // setprocessedString(res)
          console.log(res);
        })
        .catch((err) => {
          // toast.error(err.response.data.message);
        });
    } catch (err) {
      // toast.error("Sign In failed");
    } finally {
      setisLoading(false);
    }
  };
  return (
    <div className="app">
      <div className="hero__section">
        <img src={heroImage} className="hero__image" />
        <h1 className="hero__title">SKANNR.</h1>
        <p className="hero__subtext">
          In publishing and graphic design, Lorem ipsum is a placeholder text
          commonly used to demonstrate the visual form of a document or a
          typeface without relying on meaningful content. Lorem ipsum may be
          used as a placeholder before final copy is available.
        </p>
      </div>
      <div className="file__input__section">
        <form
          className="form"
          onSubmit={(e) => onSubmit(e)}
          encType="multipart/form-data"
        >
          {file && (
            <CloseSquare
              size="32"
              className="remove__file__btn"
              onClick={() => {
                setFile(null);
                setIsDragging(false);
              }}
            />
          )}
          <label
            htmlFor="file-upload"
            className="custom__file__upload__label"
            style={{
              opacity: isInputActive() ? 0.5 : 1,
              backgroundColor: isInputActive() ? "#fdfdfd14" : "transparent",
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const dt = e.dataTransfer;
              setFile(dt.files && dt.files[0]);
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
            <Image size="32" color="#FF8A65" /> <br></br>
            {file?.name || "Browse or Drop File Here"}
          </label>
          <input
            name="file"
            hidden
            type="file"
            placeholder="drop file"
            className="input"
            id="file-upload"
            onChange={(e) => {
              setFile(e.target.files && e.target.files[0]);
            }}
          />
          <button type="submit">Convert</button>
        </form>
      </div>
    </div>
  );
}

export default App;
