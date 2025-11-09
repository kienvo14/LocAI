// src/components/Main/HomePage.jsx
import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { SpeedInsights } from "@vercel/speed-insights/react";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "../../input.css";

const Home = () => {
  const { startScroll, minimize } = useSelector((state) => state.app);
  const headerRef = useRef(null);

  const [listings, setListings] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch property data
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/properties");
        const data = await res.json();

        // Normalize each item to consistent keys we use in the UI
        const normalized = (data || []).map((item, idx) => {
          const image =
            item.img ||
            item.image ||
            item.image_url ||
            item.img_url ||
            item.photo ||
            "/placeholder.jpg";

          // Title: prefer `name` or first part of address
          const title =
            item.name ||
            item.title ||
            (item.address ? item.address.split(",")[0] : `Property ${idx + 1}`);

          return {
            id: item.id ?? `p-${idx}`,
            title,
            image,
            price: item.price ?? item.rent ?? item.monthly ?? "N/A",
            bedrooms: item.bedrooms ?? item.bedroom ?? null,
            address: item.address ?? "",
            link: item.link ?? item.url ?? "#",
          };
        });

        // optional: remove duplicates by id
        const unique = [];
        const seen = new Set();
        for (const it of normalized) {
          if (!seen.has(it.id)) {
            unique.push(it);
            seen.add(it.id);
          }
        }

        setListings(unique);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleShowMore = () => setVisibleCount((p) => p + 9);
  const visibleListings = listings.slice(0, visibleCount);

  // Header animation classes (keeps the behavior you had)
  const getHeaderClasses = () => {
    const base =
      "fixed transition-all duration-300 ease-in-out bg-white w-full flex items-start justify-center top-0";
    const zIndex = minimize ? "z-50" : "z-10";
    const heightClass = startScroll
      ? minimize
        ? "animate-collapse"
        : "1sm:h-[11rem]"
      : minimize
      ? "animate-expand"
      : "h-[5rem]";
    return `${base} ${zIndex} ${heightClass}`;
  };

  return (
    <div className="flex flex-col items-center justify-center relative bg-white">
      {/* Header */}
      <div ref={headerRef} id="header" className={getHeaderClasses()}>
        <Header headerRef={headerRef} />
      </div>

      {/* Listings Section */}
      <div className="w-full flex flex-col items-center justify-center mt-[7rem] 2xl:mt-[14rem] 1sm:mt-[13rem] px-4">
        {isLoading ? (
          <p className="text-gray-500 text-center mt-20">Loading properties...</p>
        ) : visibleListings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full">
              {visibleListings.map((item) => (
                <article
                  key={item.id}
                  className="border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-3 bg-white flex flex-col"
                >
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-48 mb-3 overflow-hidden rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </a>

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 text-sm mt-1 truncate">
                      {item.address}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-gray-800 font-semibold">
                        ${item.price}
                      </div>

                      <div className="text-sm text-gray-600">
                        {item.bedrooms !== null ? `${item.bedrooms} bd` : ""}
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 underline"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {visibleCount < listings.length && (
              <div className="flex justify-center w-full">
                <button
                  onClick={handleShowMore}
                  className="mt-8 mb-12 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 font-medium transition"
                >
                  Show More
                </button>
              </div>
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
