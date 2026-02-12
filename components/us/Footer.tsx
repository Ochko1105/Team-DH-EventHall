import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-yellow-950 text-white w-full h-screen flex flex-col justify-center items-center snap-start">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
        <p className="max-w-3xl mx-auto text-lg text-yellow-200">
          Ready to book your event or have questions? Get in touch with our team
          today.
        </p>
      </div>
    </footer>
  );
};
