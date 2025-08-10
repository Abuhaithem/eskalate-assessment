import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FoodList from './components/FoodList';
import FoodForm from './components/FoodForm';
import SearchBar from './components/SearchBar';
import RestaurantList from './components/RestaurantList';
import Footer from './components/Footer';

function App() {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [foodsRes, restaurantsRes] = await Promise.all([
        axios.get('/api/foods'),
        axios.get('/api/restaurants')
      ]);
      setFoods(foodsRes.data);
      setRestaurants(restaurantsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Make sure the backend is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (foodData) => {
    try {
      const response = await axios.post('/api/foods', foodData);
      setFoods([...foods, response.data]);
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add food item');
    }
  };

  const handleUpdateFood = async (id, foodData) => {
    try {
      console.log('Updating food with ID:', id);
      console.log('Food data being sent:', foodData);
      
      const response = await axios.put(`/api/foods/${id}`, foodData);
      console.log('Update response:', response.data);
      
      setFoods(foods.map(food => food.id === id ? response.data : food));
      setEditingFood(null);
      setError(null);
    } catch (error) {
      console.error('Update error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to update food item');
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    
    try {
      await axios.delete(`/api/foods/${id}`);
      setFoods(foods.filter(food => food.id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete food item');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(foods.map(food => food.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Food Management System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">F</span>
              </div>
              <h1 className="text-3xl font-bold text-orange-500">
                FoodWagen
              </h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
            >
              + Add Meal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Are you starving?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Within a few clicks, find meals that are accessible near you
              </p>
              
              {/* Search Widget */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex space-x-1 mb-4">
                  <button className="flex-1 bg-orange-100 text-orange-700 py-2 px-4 rounded-l-lg font-medium flex items-center justify-center space-x-2">
                    <span>🛵</span>
                    <span>Delivery</span>
                  </button>
                  <button className="flex-1 bg-white text-gray-600 py-2 px-4 rounded-r-lg font-medium flex items-center justify-center space-x-2">
                    <span>🛍️</span>
                    <span>Pickup</span>
                  </button>
                </div>
                
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="What do you like to eat today?"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <span className="absolute left-4 top-3 text-orange-500">🔍</span>
                  </div>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    🔍 Find Meal
                  </button>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop&crop=center"
                alt="Delicious Food"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-700 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-red-100 text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-12">
          <SearchBar
            onSearch={handleSearch}
            onCategoryFilter={handleCategoryFilter}
            categories={categories}
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Featured Meals Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Featured Meals</h2>
          <FoodList
            foods={filteredFoods}
            restaurants={restaurants}
            onEdit={setEditingFood}
            onDelete={handleDeleteFood}
          />
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-lg">
            Load more &gt;
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Add/Edit Food Modal */}
      {showAddForm && (
        <FoodForm
          restaurants={restaurants}
          onSubmit={handleAddFood}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingFood && (
        <FoodForm
          food={editingFood}
          restaurants={restaurants}
          onSubmit={(foodData) => handleUpdateFood(editingFood.id, foodData)}
          onCancel={() => setEditingFood(null)}
        />
      )}
    </div>
  );
}

export default App; 