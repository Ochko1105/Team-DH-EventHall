import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <span className="loader">
        <span className="loader-inner loader-before" />
        <span className="loader-inner loader-after" />
      </span>

      <style jsx>{`
        .loader-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }

        .loader {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          position: relative;
          background: rgba(255, 255, 255, 0.8);
        }

        .loader-inner {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #fff;
          opacity: 0.5;
        }

        .loader-before {
          animation: slide 1s infinite linear alternate;
        }

        .loader-after {
          animation: slide2 1s infinite linear alternate;
          opacity: 1;
        }

        @keyframes slide {
          0%,
          20% {
            transform: translate(0, 0);
          }
          80%,
          100% {
            transform: translate(15px, 15px);
          }
        }

        @keyframes slide2 {
          0%,
          20% {
            transform: translate(0, 0);
          }
          80%,
          100% {
            transform: translate(-15px, -15px);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
