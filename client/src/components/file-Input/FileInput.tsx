import { CloseSquare, Image, Scan } from "iconsax-react";
import { FC, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { errorMessage } from "../../utils/toast";
import { FileInputProps } from "./file-input.types";
import './file-input.css'

export const FileInput: FC<FileInputProps> = ({
  onSubmit,
  setImageData,
  setIsModalOpen,
  isLoading,
  setImageBase64String,
  imageBase64String,
  imageData,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

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

  const handleChange = (file: File) => {
    if (file) {
      if (!file.type.match(/image.*/)) {
        errorMessage("kindly select an image");
      }
      getBase64(file);
    }
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

  return (
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
          accept="image/*"
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
        {!!imageData && (
          <button onClick={() => setIsModalOpen(true)} type="button">
            View Image Text
          </button>
        )}
        <button
          type="submit"
          disabled={!imageBase64String || isLoading || !!imageData}
        >
          {isLoading ? `Reading text...` : "Convert"}
          {isLoading && <Scan size="32" className="scan__loader" />}
        </button>
      </form>
    </div>
  );
};
