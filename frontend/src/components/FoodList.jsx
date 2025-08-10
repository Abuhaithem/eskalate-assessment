import React from 'react';

const FoodList = ({ foods, restaurants, onEdit, onDelete }) => {
  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'Unknown Restaurant';
  };

  if (foods.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
        <p className="text-gray-400">No food items found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {foods.map((food) => (
        <div key={food.id} className="food-card bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {/* Food Image with Price Tag */}
          <div className="relative">
            <img 
              src={food.imageUrl} 
              alt={food.name}
              className="w-full h-48 object-cover"
            />
            <div className="price-tag absolute top-3 left-3 text-white px-3 py-1 rounded-lg text-sm font-medium">
              💎 ${food.price}
            </div>
          </div>
          
          {/* Food Details */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {getRestaurantName(food.restaurantId).charAt(0)}
                  </span>
                </div>
                <span className="text-white text-sm font-medium">
                  {getRestaurantName(food.restaurantId)}
                </span>
              </div>
              
              {/* Menu Dots */}
              <div className="relative group">
                <button className="text-gray-400 hover:text-white p-1">
                  ⋮
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={() => onEdit(food)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(food.id)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            
            <h3 className="text-white text-lg font-semibold mb-2">{food.name}</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">★</span>
                <span className="text-white text-sm">4.5</span>
              </div>
              
              <span className="status-open text-white text-xs px-2 py-1 rounded-full">
                Open
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FoodList; 