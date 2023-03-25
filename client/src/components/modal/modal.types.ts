import { Dispatch, SetStateAction } from "react";

export interface ModalProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  downloadPDF: () => Promise<void>;
  imageDataText: string;
}
