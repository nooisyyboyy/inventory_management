import { useEffect } from "react";
import { toast } from "react-toastify";
import LayoutComponent from "../Components/Layout";

export default function Home() {
  useEffect(() => {
    if (window.location.href.includes("message")) {
      let message = decodeURI(window.location.href.split("=").pop());
      toast(message, {
        position: "bottom-right",
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, []);
  return <LayoutComponent></LayoutComponent>;
}
