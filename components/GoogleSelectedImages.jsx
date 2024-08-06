"use client";

import { useState } from "react";

const GooglePhotosGallery = ({ mediaItems, onSelect }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleImageClick = (item) => {
    setSelectedItem(item);
  };

  const handleConfirm = () => {
    if (selectedItem) {
      onSelect(selectedItem);
      setSelectedItem(null);
    }
  };

  const handleCancel = () => {
    setSelectedItem(null);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {mediaItems?.map((item) => (
        <div
          key={item.id}
          className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
          onClick={() => handleImageClick(item)}
        >
          <img
            src={item.baseUrl}
            alt={item.filename}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">Select</span>
          </div>
        </div>
      ))}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-2">Confirm Selection</h3>
            <img
              src={selectedItem.baseUrl}
              alt={selectedItem.filename}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <p className="mb-4">Are you sure you want to select this image?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GooglePhotosGallery;
