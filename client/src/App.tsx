import axios from "axios";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { imageData } from "./components/file-Input/file-input.types";
import { FileInput } from "./components/file-Input/FileInput";
import { HeroSection } from "./components/hero-section/HeroSection";
import { Modal } from "./components/modal/Modal";
import { errorMessage } from "./utils/toast";


function App() {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [imageData, setImageData] = useState<imageData | null>();
  const [imageBase64String, setImageBase64String] = useState<string[]>([]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setisLoading(true);

    try {
      await axios
        .post(`http://localhost:8080/api/process-file`, {
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
    <div className="app_wrapper">
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          downloadPDF={downloadPDF}
          imageDataText={imageData?.text || ""}
        />
      )}
     <HeroSection/>
      <FileInput
        setImageBase64String={setImageBase64String}
        imageBase64String={imageBase64String}
        onSubmit={onSubmit}
        isLoading={isLoading}
        setIsModalOpen={setIsModalOpen}
        setImageData={setImageData}
        imageData={imageData}
      />
      <ToastContainer />
    </div>
  );
}

export default App;
