// src/components/Main/MainForm.jsx
import React, { useState } from "react";
import searchIcon from "../../../asset/Icons_svg/search-icon.svg";

/**
 * Props:
 *  - onSearch(data: array)  => called with filtered properties returned by backend
 *
 * The form POSTs to /properties with JSON body of filters:
 *  { schoolAddress, priceRange: [min,max], maxCommuteMinutes, hasCar, petsAllowed, publicTransport, use_network }
 */
const MainForm = ({ onSearch }) => {
  const [form, setForm] = useState({
    schoolAddress: "",
    priceRange: [0, 2000],
    maxCommuteMinutes: 10,
    hasCar: false,
    petsAllowed: false,
    publicTransport: false,
    use_network: false, // optional: try OSM network route distances (heavier)
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "minPrice") {
      setForm((prev) => ({ ...prev, priceRange: [Number(value || 0), prev.priceRange[1]] }));
    } else if (name === "maxPrice") {
      setForm((prev) => ({ ...prev, priceRange: [prev.priceRange[0], Number(value || 0)] }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:5000/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolAddress: form.schoolAddress,
          priceRange: form.priceRange,
          maxCommuteMinutes: form.maxCommuteMinutes,
          hasCar: form.hasCar,
          petsAllowed: form.petsAllowed,
          publicTransport: form.publicTransport,
          use_network: form.use_network,
        }),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      // pass filtered results to parent
      if (onSearch) onSearch(data);
    } catch (err) {
      console.error("Search error:", err);
      alert("Search failed — see console.");
    }
  };

  const booleanOptions = [
    { name: "hasCar", label: "Has Car" },
    { name: "petsAllowed", label: "Pets Allowed" },
    { name: "publicTransport", label: "Public Transport" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center justify-center max-w-4xl mx-auto space-x-2 space-y-2"
    >
      <div className="flex flex-col items-center group">
        <label className="text-gray-500 text-xs mb-1">School Name</label>
        <input
          type="text"
          name="schoolAddress"
          placeholder="School address"
          value={form.schoolAddress}
          onChange={handleChange}
          className="flex-1 px-4 py-2 focus:outline-none focus:bg-gray-100 placeholder-gray-400 rounded-md hover:bg-gray-100 transition-colors duration-150"
        />
      </div>

      <div className="w-px bg-gray-300 h-6 mx-2" />

      <div className="flex flex-col items-center group">
        <label className="text-gray-500 text-xs mb-1">Price Range</label>
        <div className="flex items-center rounded-md overflow-hidden hover:bg-gray-100 transition-colors duration-150">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={form.priceRange[0]}
            onChange={handleChange}
            className="w-20 px-2 py-2 focus:outline-none placeholder-gray-400"
          />
          <span className="px-1 text-gray-500">-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={form.priceRange[1]}
            onChange={handleChange}
            className="w-20 px-2 py-2 focus:outline-none placeholder-gray-400"
          />
        </div>
      </div>

      <div className="w-px bg-gray-300 h-6 mx-2" />

      <div className="flex flex-col items-center group">
        <label className="text-gray-500 text-xs mb-1">Distance (Miles)</label>
        <input
          type="number"
          name="maxCommuteMinutes"
          placeholder="Max Distance"
          value={form.maxCommuteMinutes}
          onChange={handleChange}
          className="w-24 px-2 py-2 focus:outline-none focus:bg-gray-100 placeholder-gray-400 rounded-md hover:bg-gray-100 transition-colors duration-150"
        />
      </div>

      <div className="w-px bg-gray-300 h-6 mx-2" />

      <div className="flex items-center space-x-4">
        {booleanOptions.map((opt) => (
          <label
            key={opt.name}
            className="flex items-center space-x-1 text-gray-500 text-xs px-2 py-1 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-150"
          >
            <input
              type="checkbox"
              name={opt.name}
              checked={form[opt.name]}
              onChange={handleChange}
              className="accent-blue-500"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="bg-blue-500 p-3 rounded-full ml-2 flex items-center justify-center hover:bg-blue-600 transition-colors duration-150"
      >
        <img src={searchIcon} alt="Search" className="w-5 h-5" />
      </button>
    </form>
  );
};

export default MainForm;
