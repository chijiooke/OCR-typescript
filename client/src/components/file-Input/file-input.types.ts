import { SetStateAction } from "react";

export interface imageData {
  text: string;
  PDF_URL: string;
  pdf: BlobPart[];
}
export interface FileInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setImageBase64String: React.Dispatch<React.SetStateAction<string[]>>;
  imageBase64String: string[];
  imageData: imageData | null | undefined;
  setImageData: React.Dispatch<SetStateAction<imageData | null | undefined>>;
}
