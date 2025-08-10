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
    description: "Classic tomato and mozzarella pizza with fresh basil",
    price: 12.99,
    category: "Italian",
    restaurantId: 1,
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400"
  },
  {
    id: 2,
    name: "Chicken Burger",
    description: "Grilled chicken with fresh vegetables and special sauce",
    price: 8.99,
    category: "American",
    restaurantId: 2,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
  },
  {
    id: 3,
    name: "Sushi Roll Combo",
    description: "Fresh salmon, tuna, and avocado rolls with wasabi and ginger",
    price: 18.99,
    category: "Japanese",
    restaurantId: 3,
    imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400"
  },
  {
    id: 4,
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, parmesan cheese, croutons with caesar dressing",
    price: 9.99,
    category: "Salad",
    restaurantId: 1,
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400"
  },
  {
    id: 5,
    name: "Beef Tacos",
    description: "Seasoned ground beef with lettuce, cheese, and salsa in corn tortillas",
    price: 11.99,
    category: "Mexican",
    restaurantId: 4,
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400"
  },
  {
    id: 6,
    name: "Pasta Carbonara",
    description: "Spaghetti with eggs, cheese, pancetta, and black pepper",
    price: 14.99,
    category: "Italian",
    restaurantId: 1,
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400"
  },
  {
    id: 7,
    name: "Fish & Chips",
    description: "Crispy battered cod with golden fries and tartar sauce",
    price: 13.99,
    category: "British",
    restaurantId: 2,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
  },
  {
    id: 8,
    name: "Chicken Curry",
    description: "Spicy chicken curry with rice, naan bread, and chutney",
    price: 16.99,
    category: "Indian",
    restaurantId: 5,
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400"
  },
  {
    id: 9,
    name: "Steak Frites",
    description: "Grilled ribeye steak with crispy french fries and herb butter",
    price: 24.99,
    category: "French",
    restaurantId: 6,
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400"
  },
  {
    id: 10,
    name: "Ramen Bowl",
    description: "Rich pork broth with noodles, soft-boiled egg, and chashu pork",
    price: 15.99,
    category: "Japanese",
    restaurantId: 3,
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400"
  },
  {
    id: 11,
    name: "Greek Gyro",
    description: "Marinated lamb with tzatziki sauce, tomatoes, and onions in pita",
    price: 10.99,
    category: "Greek",
    restaurantId: 7,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"
  },
  {
    id: 12,
    name: "Chocolate Cake",
    description: "Rich chocolate layer cake with chocolate ganache and fresh berries",
    price: 7.99,
    category: "Dessert",
    restaurantId: 8,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"
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
  },
  {
    id: 3,
    name: "Sakura Sushi",
    cuisine: "Japanese",
    address: "789 Cherry Blossom Ln, City",
    rating: 4.7
  },
  {
    id: 4,
    name: "El Mariachi",
    cuisine: "Mexican",
    address: "321 Taco Way, City",
    rating: 4.4
  },
  {
    id: 5,
    name: "Spice Garden",
    cuisine: "Indian",
    address: "654 Curry Rd, City",
    rating: 4.6
  },
  {
    id: 6,
    name: "Le Bistro",
    cuisine: "French",
    address: "987 Eiffel Ave, City",
    rating: 4.8
  },
  {
    id: 7,
    name: "Athena's",
    cuisine: "Greek",
    address: "147 Olive St, City",
    rating: 4.3
  },
  {
    id: 8,
    name: "Sweet Dreams",
    cuisine: "Dessert",
    address: "258 Sugar Pl, City",
    rating: 4.5
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