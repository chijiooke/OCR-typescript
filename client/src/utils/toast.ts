import { toast } from "react-toastify";


export const successMessage = (message: string) => {
  toast.success(`🚀  ${message}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};


export const errorMessage = (message: string) => {
  toast.error(`🚀  ${message}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};
