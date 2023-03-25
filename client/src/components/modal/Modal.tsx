import { CloseCircle, DocumentCopy, DocumentDownload } from "iconsax-react";
import { FC } from "react";
import { errorMessage, successMessage } from "../../utils/toast";
import "./modal.css";
import { ModalProps } from "./modal.types";

export const Modal: FC<ModalProps> = ({
  setIsModalOpen,
  downloadPDF,
  imageDataText,
}) => {
  
  const copyToClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      successMessage("text copied to clipboard");
    } catch (err) {
      errorMessage("failed to copy, try again");
    }
  };

  return (
    <div
      className="image__text__modal__wrapper"
      onClick={() => setIsModalOpen(false)}
    >
      <div className="image__text__modal" onClick={(e) => e.stopPropagation()}>
        <CloseCircle
          size="32"
          style={{ alignSelf: "end", display: "flex" }}
          onClick={() => {
            setIsModalOpen(false);
          }}
        />
        <p>{imageDataText}</p>
        <button
          onClick={() => {
            if (!!imageDataText) copyToClipBoard(imageDataText);
          }}
        >
          <DocumentCopy size="32" /> Copy to clipboard
        </button>
        <button
          onClick={() => {
            downloadPDF();
          }}
        >
          <DocumentDownload size="32" />
          Download Image as PDF
        </button>
      </div>
    </div>
  );
};
