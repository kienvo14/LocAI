import React, { useState } from "react";

const MainForm = () => {
  const [form, setForm] = useState({
    schoolAddress: "",
    priceRange: [0, 1000],
    petsAllowed: false,
    hasCar: false,
    maxCommuteMinutes: 30,
    commuteMethod: "walk",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "minPrice") {
      setForm((prev) => ({
        ...prev,
        priceRange: [Number(value), prev.priceRange[1]],
      }));
    } else if (name === "maxPrice") {
      setForm((prev) => ({
        ...prev,
        priceRange: [prev.priceRange[0], Number(value)],
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    alert(JSON.stringify(form, null, 2));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow-md max-w-xl mx-auto space-y-4"
    >
      <h2 className="text-lg font-semibold">User Preferences</h2>

      {/* School Address */}
      <input
        type="text"
        name="schoolAddress"
        placeholder="School address"
        value={form.schoolAddress}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* Price Range */}
      <div className="flex space-x-2">
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={form.priceRange[0]}
          onChange={handleChange}
          className="w-1/2 border p-2 rounded"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={form.priceRange[1]}
          onChange={handleChange}
          className="w-1/2 border p-2 rounded"
        />
      </div>

      {/* Pets Allowed */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="petsAllowed"
          checked={form.petsAllowed}
          onChange={handleChange}
        />
        <span>Pets Allowed</span>
      </label>

      {/* Has Car */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="hasCar"
          checked={form.hasCar}
          onChange={handleChange}
        />
        <span>Has Car</span>
      </label>

      {/* Max Commute Minutes */}
      <input
        type="number"
        name="maxCommuteMinutes"
        placeholder="Max Commute Miles"
        value={form.maxCommuteMinutes}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Save Preferences
      </button>
    </form>
  );
};

export default MainForm;
