import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { SpeedInsights } from "@vercel/speed-insights/react";

import Header from "../Header/Header";
import Options from "./Options";
import Footer from "../Footer/Footer";
import "../../input.css";

const Home = () => {
  const { startScroll, minimize } = useSelector((state) => state.app);
  const headerRef = useRef(null);

  const [listings, setListings] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch property data from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/properties");
        const data = await res.json();
        setListings(data);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleShowMore = () => setVisibleCount((prev) => prev + 9);
  const visibleListings = listings.slice(0, visibleCount);

  // Header and Options animation logic
  const getHeaderClasses = () => {
    const baseClasses =
      "fixed transition-all duration-300 ease-in-out bg-white w-full flex items-start justify-center top-0";
    const zIndexClass = minimize ? "z-50" : "z-10";
    const heightClass = startScroll
      ? minimize
        ? "animate-collapse"
        : "1sm:h-[11rem]"
      : minimize
      ? "animate-expand"
      : "h-[5rem]";
    return `${baseClasses} ${zIndexClass} ${heightClass}`;
  };

  const getOptionsClasses = () => {
    const baseClasses =
      "transition-all duration-300 ease-in-out fixed z-10 w-full bg-white shadow-md 1sm:shadow-none flex-center";
    const visibilityClass = startScroll
      ? "1md:translate-y-0 1sm:translate-y-[3rem]"
      : "1sm:-translate-y-[5.9rem] !shadow-md";
    const positionClass = "1sm:top-[10.8rem] top-[5.7rem]";
    return `${baseClasses} ${visibilityClass} ${positionClass}`;
  };

  return (
    <div className="flex flex-col items-center justify-center relative bg-white">
      {/* Header */}
      <div ref={headerRef} id="header" className={getHeaderClasses()}>
        <Header headerRef={headerRef} />
      </div>

      {/* Filter / Options */}
      <div className={getOptionsClasses()}>
        <Options />
      </div>

      {/* Listings Section */}
      <div className="w-full flex flex-col items-center justify-center mt-[7rem] 2xl:mt-[14rem] 1sm:mt-[13rem] px-4">
        {isLoading ? (
          <p className="text-gray-500 text-center mt-20">Loading properties...</p>
        ) : visibleListings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full">
              {visibleListings.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col bg-white"
                >
                  <img
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.title || "Property"}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.title || "Untitled Listing"}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {item.address || "No address available"}
                  </p>
                  <p className="text-gray-800 font-semibold mt-2">
                    ${item.price || "N/A"} / month
                  </p>
                </div>
              ))}
            </div>

            {visibleCount < listings.length && (
              <button
                onClick={handleShowMore}
                className="mt-8 mb-12 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-medium transition"
              >
                Show More
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center mt-20">No properties found.</p>
        )}
      </div>

      {/* Footer */}
      <div className="w-full bg-white border-t border-gray-200 mt-10">
        <Footer />
      </div>

      <SpeedInsights />
    </div>
  );
};

export default Home;
