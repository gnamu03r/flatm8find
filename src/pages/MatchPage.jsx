import React from 'react';

const MatchPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Your Flatmate Matches</h1>
      <div className="mt-4">
        <div className="p-4 border border-gray-300 mb-4 rounded">
          <h3 className="font-bold">John Doe</h3>
          <p className="text-gray-600">Cleanliness: 5 | Music: 3 | Study: 4</p>
          <button className="mt-2 bg-green-500 text-white p-2 rounded">Contact</button>
        </div>
        {/* More matches will be listed here */}
      </div>
    </div>
  );
};

export default MatchPage;
