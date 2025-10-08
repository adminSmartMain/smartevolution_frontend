import { toast } from "react-toastify";

import Image from "next/image";

export const Toast = (message, type) => {
  if (type == "success") {
  return toast.success(
    <div style={{ 
      display: "flex", 
      alignItems: "center",
      padding: "8px 16px"
    }}>
      <Image
        src="/assets/image-removebg-preview.png"
        alt="gif"
        width={"30px"}
        height={"30px"}
      />
      <strong style={{ fontSize: "13px", marginLeft: "10px", color: "#FFFFFF" }}>
        {message}
      </strong>
      
      {/* Barra de progreso personalizada */}
      <style>{`
        .Toastify__progress-bar--success {
          background: rgba(255, 255, 255, 0.4) !important;
        }
        .Toastify__toast--success {
          background: #4CAF50 !important;
        }
      `}</style>
    </div>,
    {
      position: "bottom-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      toastId: "toast1",
      icon: false,
    }
  );
} else if (type == "error") {
    return toast.error(
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >  <Image
        src="/assets/image-removebg-preview_error.png"
        alt="gif"
        width={"30px"}
        height={"30px"}
      />
         <strong style={{ fontSize: "13px", marginLeft: "10px", color: "#FFFFFF" }}>
          {message}
        </strong>
         {/* Barra de progreso personalizada */}
      <style>{`
        .Toastify__progress-bar--success {
          background: rgba(255, 255, 255, 0.4) !important;
        }
        .Toastify__toast--success {
          background: #4CAF50 !important;
        }
      `}</style>
      </div>,
      {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: "toast2",
        icon: false,
      }
    );
  } else if (type == "warning") {
    return toast.warning(
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
       <Image
        src="/assets/image-removebg-preview_warning.png"
        alt="gif"
        width={"30px"}
        height={"30px"}
      />
        <strong style={{ fontSize: "13px", marginLeft: "10px", color: "#FFFFFF" }}>
          {message}
        </strong>
         {/* Barra de progreso personalizada */}
      <style>{`
        .Toastify__progress-bar--success {
          background: rgba(255, 255, 255, 0.4) !important;
        }
        .Toastify__toast--success {
          background: #4CAF50 !important;
        }
      `}</style>
      </div>,
      {
        position: "bottom-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: "toast3",
        icon: false,
      }
    );
  } else {
    return toast.info(
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
        src="/assets/image-removebg-preview_info.png"
        alt="gif"
        width={"30px"}
        height={"30px"}
      />
        <strong style={{ fontSize: "13px", marginLeft: "10px", color: "#FFFFFF" }}>
          {message}
        </strong>
         {/* Barra de progreso personalizada */}
      <style>{`
        .Toastify__progress-bar--success {
          background: rgba(255, 255, 255, 0.4) !important;
        }
        .Toastify__toast--success {
          background: #4CAF50 !important;
        }
      `}</style>
      </div>,
      {
        position: "bottom-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: "toast4",
        icon: false,
      }
    );
  }
};
