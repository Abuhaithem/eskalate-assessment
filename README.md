# Food Management System - A2SV Eskalate Assessment

## **CHOSEN PATH: PATH A (Recommended)**
**Focus**: Building a rock-solid backend API with basic frontend functionality to demonstrate API functionality.

## Project Overview
A functional and user-friendly website that allows users to efficiently manage food items. The system enables users to:
- **Search** for food items quickly and accurately
- **Add, edit, and remove** food items with ease  
- **View** a well-organized list of available food items

## Tech Stack
- **Backend**: Node.js + Express.js + In-memory data store
- **Frontend**: React + Vite + Tailwind CSS
- **Data Validation**: Joi (backend), HTML5 (frontend)
- **HTTP Client**: Axios

## Features Implemented
✅ Complete RESTful API for Food and Restaurant entities  
✅ CRUD operations (Create, Read, Update, Delete)  
✅ Data validation and error handling  
✅ Search functionality  
✅ Responsive frontend with forms and lists  
✅ In-memory data persistence  

## Quick Start
1. Install dependencies: `npm run install-all`
2. Start development servers: `npm run dev`
3. Backend API runs on: http://localhost:5000
4. Frontend runs on: http://localhost:5173

## API Endpoints
- `GET /api/foods` - Get all foods
- `POST /api/foods` - Create new food
- `PUT /api/foods/:id` - Update food
- `DELETE /api/foods/:id` - Delete food
- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants` - Create new restaurant
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant

## Assessment Compliance
- ✅ Follows Path A requirements (solid backend + basic frontend)
- ✅ Implements all required CRUD operations
- ✅ Uses descriptive endpoint naming
- ✅ Includes proper error handling and validation
- ✅ Uses in-memory data store as specified
- ✅ Clean, scalable, and well-documented code 