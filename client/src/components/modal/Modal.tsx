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

  const year = new Date().getFullYear();
  return (
    <div
      className="image__text__modal__wrapper"
      onClick={() => setIsModalOpen(false)}
    >
      <div className="image__text__modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <p> Text from yout image 😎</p>
          <CloseCircle
            size="24"
            className="close__modal__btn"
            onClick={() => {
              setIsModalOpen(false);
            }}
          />
        </div>

        <p>{imageDataText}</p>
        <div className="btn__wrapper">
          <button
            onClick={() => {
              if (!!imageDataText) copyToClipBoard(imageDataText);
            }}
          >
            <DocumentCopy size="32" /> Copy to clipboard
          </button>
          <button
            className="pdf__download__btn"
            onClick={() => {
              downloadPDF();
            }}
          >
            <DocumentDownload size="32" />
            Download Image as PDF
          </button>
        </div>
        <span>
          skannr © {year} | by  {""}
          <a href="//chijiooke.netlify.com" target="_blank">Silva Chijioke Michael</a>
        </span>
      </div>
    </div>
  );
};
