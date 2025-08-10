const express = require('express');
const cors = require('cors');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let foods = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Classic tomato and mozzarella pizza",
    price: 12.99,
    category: "Italian",
    restaurantId: 1,
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400"
  },
  {
    id: 2,
    name: "Chicken Burger",
    description: "Grilled chicken with fresh vegetables",
    price: 8.99,
    category: "American",
    restaurantId: 2,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
  }
];

let restaurants = [
  {
    id: 1,
    name: "Pizza Palace",
    cuisine: "Italian",
    address: "123 Main St, City",
    rating: 4.5
  },
  {
    id: 2,
    name: "Burger House",
    cuisine: "American",
    address: "456 Oak Ave, City",
    rating: 4.2
  }
];

// Validation schemas
const foodSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  price: Joi.number().positive().precision(2).required(),
  category: Joi.string().min(2).max(50).required(),
  restaurantId: Joi.number().integer().positive().required(),
  imageUrl: Joi.string().uri().optional()
});

const restaurantSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  cuisine: Joi.string().min(2).max(50).required(),
  address: Joi.string().min(10).max(200).required(),
  rating: Joi.number().min(0).max(5).precision(1).required()
});

// Helper functions
const generateId = (items) => Math.max(...items.map(item => item.id), 0) + 1;
const findItemById = (items, id) => items.find(item => item.id === parseInt(id));

// Food Routes
app.get('/api/foods', (req, res) => {
  try {
    const { search, category, restaurantId } = req.query;
    let filteredFoods = [...foods];

    if (search) {
      filteredFoods = filteredFoods.filter(food => 
        food.name.toLowerCase().includes(search.toLowerCase()) ||
        food.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredFoods = filteredFoods.filter(food => 
        food.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (restaurantId) {
      filteredFoods = filteredFoods.filter(food => 
        food.restaurantId === parseInt(restaurantId)
      );
    }

    res.json(filteredFoods);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/foods', (req, res) => {
  try {
    const { error, value } = foodSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const restaurant = findItemById(restaurants, value.restaurantId);
    if (!restaurant) {
      return res.status(400).json({ error: 'Restaurant not found' });
    }

    const newFood = {
      id: generateId(foods),
      ...value
    };

    foods.push(newFood);
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/foods/:id', (req, res) => {
  try {
    const food = findItemById(foods, req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    const { error, value } = foodSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const restaurant = findItemById(restaurants, value.restaurantId);
    if (!restaurant) {
      return res.status(400).json({ error: 'Restaurant not found' });
    }

    Object.assign(food, value);
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/foods/:id', (req, res) => {
  try {
    const foodIndex = foods.findIndex(food => food.id === parseInt(req.params.id));
    if (foodIndex === -1) {
      return res.status(404).json({ error: 'Food not found' });
    }

    foods.splice(foodIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Restaurant Routes
app.get('/api/restaurants', (req, res) => {
  try {
    const { search, cuisine } = req.query;
    let filteredRestaurants = [...restaurants];

    if (search) {
      filteredRestaurants = filteredRestaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (cuisine) {
      filteredRestaurants = filteredRestaurants.filter(restaurant => 
        restaurant.cuisine.toLowerCase() === cuisine.toLowerCase()
      );
    }

    res.json(filteredRestaurants);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Food Management API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Food Management API running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
}); 