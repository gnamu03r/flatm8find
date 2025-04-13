import React from 'react';

const HomePage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Find Your Perfect Flatmate</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded"
          placeholder="Search for flatmates"
        />
        <button className="ml-2 p-2 bg-blue-500 text-white rounded">Search</button>
      </div>

      <div>
        <h2 className="font-semibold">Available Rooms / Flatmates:</h2>
        {/* You will map through available listings here */}
        <div className="mt-4">
          <div className="p-4 border border-gray-300 mb-4 rounded">
            <h3 className="font-bold">Room in Central Location</h3>
            <p className="text-gray-600">Looking for a clean, quiet flatmate.</p>
            <button className="mt-2 bg-green-500 text-white p-2 rounded">Contact</button>
          </div>
          {/* More rooms will be listed here */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
