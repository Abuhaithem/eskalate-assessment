import React from 'react';

const RestaurantList = ({ restaurants }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Restaurants ({restaurants.length})</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="p-4">
            <h3 className="font-medium text-gray-900">{restaurant.name}</h3>
            <p className="text-sm text-gray-600">{restaurant.cuisine} Cuisine</p>
            <p className="text-sm text-gray-500">{restaurant.address}</p>
            <div className="mt-2 flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-gray-600 ml-1">{restaurant.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList; 