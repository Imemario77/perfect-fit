"use client";

import { useState } from "react";
import Image from "next/image";

const dummyClothes = [
  {
    id: 1,
    name: "Blue Oxford Shirt",
    category: "tops",
    color: "blue",
    image: "/images/blue-shirt.jpg",
  },
  {
    id: 2,
    name: "Black Jeans",
    category: "bottoms",
    color: "black",
    image: "/images/black-jeans.jpg",
  },
  {
    id: 3,
    name: "Brown Leather Shoes",
    category: "shoes",
    color: "brown",
    image: "/images/brown-shoes.jpg",
  },
  {
    id: 4,
    name: "White T-Shirt",
    category: "tops",
    color: "white",
    image: "/images/white-tshirt.jpg",
  },
  {
    id: 5,
    name: "Navy Blazer",
    category: "outerwear",
    color: "navy",
    image: "/images/navy-blazer.jpg",
  },
  // Add more items as needed
];

function Wardrobe() {
  const [clothes, setClothes] = useState(dummyClothes);
  const [filter, setFilter] = useState({ category: "all", color: "all" });

  const categories = ["all", "tops", "bottoms", "shoes", "outerwear"];
  const colors = ["all", "black", "white", "blue", "brown", "navy"];

  const filteredClothes = clothes.filter(
    (item) =>
      (filter.category === "all" || item.category === filter.category) &&
      (filter.color === "all" || item.color === filter.color)
  );

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wardrobe</h1>

      <div className="mb-8 flex justify-between items-center">
        <div className="space-x-4">
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="p-2 border rounded"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filter.color}
            onChange={(e) => setFilter({ ...filter, color: e.target.value })}
            className="p-2 border rounded"
          >
            {colors.map((color) => (
              <option key={color} value={color}>
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button className="bg-primary text-bg py-2 px-4 rounded hover:bg-sec-2 transition-colors">
          Add New Item
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredClothes.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
            <Image
              src={item.image}
              alt={item.name}
              width={200}
              height={200}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-2">Category: {item.category}</p>
            <p className="text-gray-600">Color: {item.color}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Wardrobe;
