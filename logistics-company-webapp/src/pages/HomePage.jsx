import React from "react";
import Navbar from "../components/Navbar.jsx";
import logisticsImage from "../assets/images/logistics.png"; // Import the logistics image

function HomePage() {
  return (
    <div className="relative" style={{ height: "100vh", overflow: "hidden" }}>
      <Navbar />
      <div className="flex justify-center items-center absolute top-0 right-0 bottom-0 left-0 pointer-events-none">
        <h1 className="text-6xl text-green font-bold text-center bg-opacity-100">
          Logistics Company WebApp on React
        </h1>
      </div>
      <img
        src={logisticsImage}
        alt="Logistics"
        className="w-full h-auto opacity-100"
      />
    </div>
  );
}

export default HomePage;
