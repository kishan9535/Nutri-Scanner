# NutriScan: Advanced Nutrition Tracking Application

## Table of Contents
1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Setup and Installation](#setup-and-installation)
7. [Environment Variables](#environment-variables)
8. [API Routes](#api-routes)
9. [Database Schema](#database-schema)
10. [Authentication](#authentication)
11. [Barcode Scanning](#barcode-scanning)
12. [State Management](#state-management)
13. [UI Components](#ui-components)
14. [Data Visualization](#data-visualization)
15. [Deployment](#deployment)
16. [Performance Optimization](#performance-optimization)
17. [Security Considerations](#security-considerations)
18. [Testing](#testing)
19. [Contributing](#contributing)
20. [License](#license)

## Introduction

NutriScan is a cutting-edge nutrition tracking application designed to empower users in managing their dietary habits effectively. By leveraging modern web technologies and intuitive design, NutriScan offers features such as barcode scanning for food items, daily nutrient tracking, and insightful visualizations of nutritional trends.

## Tech Stack

### Frontend
- **Next.js 13**: Utilizing the App Router for optimized routing and server-side rendering
- **React 18**: For building a dynamic and responsive user interface
- **TypeScript**: Ensuring type safety and improved developer experience
- **Tailwind CSS**: For rapid and responsive UI development
- **shadcn/ui**: A collection of re-usable components built with Radix UI and Tailwind

### Backend
- **Next.js API Routes**: Serverless functions for handling API requests
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js

### Authentication
- **NextAuth.js**: Providing secure, easy-to-implement authentication

### Barcode Scanning
- **@ericblade/quagga2**: JavaScript-based barcode scanner library

### Data Visualization
- **Recharts**: Composable charting library built on React components

### Additional Libraries
- **Axios**: Promise-based HTTP client for making API requests
- **date-fns**: Modern JavaScript date utility library
- **bcryptjs**: Library for hashing passwords

### Development Tools
- **ESLint**: For identifying and reporting on patterns in JavaScript
- **Prettier**: Code formatter to ensure consistent code style
- **Husky**: For managing Git hooks

## Architecture

NutriScan follows a modern, serverless architecture leveraging the power of Next.js 13 and its App Router:

1. **Frontend**: 
   - Built with React and Next.js, utilizing the new App Router for optimized page routing and server-side rendering.
   - Components are organized into logical directories within the `app` folder.
   - Global layouts and page-specific layouts are used for consistent UI structure.

2. **Backend**:
   - Utilizes Next.js API Routes for serverless backend functionality.
   - Each API route corresponds to a specific feature or data operation.

3. **Database**:
   - MongoDB is used as the primary database, with Mongoose as the ODM.
   - The database schema is defined using Mongoose models.

4. **Authentication**:
   - NextAuth.js handles user authentication, supporting multiple providers and secure session management.

5. **State Management**:
   - React's Context API is used for global state management, particularly for user settings.
   - Server Components are leveraged to reduce client-side JavaScript and improve performance.

6. **API Integration**:
   - External APIs (e.g., food databases) are integrated using Axios for HTTP requests.

## Features

1. **User Authentication**: 
   - Secure sign-up, login, and logout functionality.
   - Password hashing using bcryptjs.

2. **Barcode Scanning**:
   - Real-time barcode scanning using device camera.
   - Manual barcode entry option.
   - Integration with food databases to fetch nutritional information.

3. **Nutrient Tracking**:
   - Daily tracking of calories, protein, carbohydrates, and fat.
   - Ability to add custom food items.

4. **Data Visualization**:
   - Weekly trends of nutritional intake.
   - Daily progress towards nutritional goals.

5. **Food Logging**:
   - Recent food log with detailed nutritional information.
   - Ability to add frequently consumed items to favorites.

6. **User Settings**:
   - Customizable nutritional goals.
   - Preferences for measurement units (metric/imperial).

7. **Responsive Design**:
   - Mobile-first approach ensuring a seamless experience across devices.

## Project Structure

NutriScan's project structure is organized for scalability and maintainability. Below is an overview:

### **`app/`**
Contains all pages and layouts structured with Next.js App Router.
- **`app/api/`**: Backend API routes for authentication, food logging, and nutrient tracking.
- **`app/scan/`**: Barcode scanning page integrating the scanner functionality.

### **`components/`**
Reusable UI components.
- **`Navbar.tsx`**: Top navigation bar.
- **`Footer.tsx`**: Application footer.
- **`Graph.tsx`**: Nutritional data visualization.

### **`lib/`**
Helper libraries and utilities.
- **`dbConnect.ts`**: MongoDB connection utility.

### **`models/`**
Database schema definitions.
- **`User.ts`**: User schema including `foodList`, `dailyIntake`, and preferences.
- **`FoodItem.ts`**: Schema for individual food items.

### **`services/`**
Abstractions for external API integrations.
- **`foodService.ts`**: OpenFoodFacts API integration.

### **`utils/`**
Utility functions for data processing and transformations.
- **`barcodeDetector.ts`**: Handles barcode detection logic.

### **`styles/`**
Global CSS and Tailwind configurations.

## Barcode Scanning

### **Implementation Details**
The barcode scanning feature in NutriScan is designed for efficiency and accuracy:

1. **Technology**:
   - Uses `@ericblade/quagga2` for browser-based barcode detection.
   - Integrated with `react-webcam` for real-time camera feed.

2. **Core Functionality**:
   - **Real-Time Scanning**: Processes frames from the camera to detect barcodes.
   - **Fallback Options**: Allows image upload and manual barcode entry for accessibility.
   - **Supported Formats**: Recognizes EAN, UPC, and CODE 128 barcode formats.

3. **Error Handling**:
   - Debounced scanning to prevent repeated detection failures.
   - Real-time feedback for undetectable or invalid barcodes.

4. **Integration with OpenFoodFacts**:
   - Queries the database for product details based on barcode value.
   - Caches results in MongoDB to minimize redundant API calls.

5. **Optimization**:
   - Image preprocessing (contrast, brightness adjustments).
   - Multiple detection passes for enhanced reliability.

## Database Schema

### **Schema Structure**
The MongoDB database structure ensures efficient data organization:

1. **User Schema**:
   - `email`: User's email address (unique).
   - `password`: Hashed password.
   - `foodList`: Array of food items logged by the user.
   - `dailyIntake`: Nested schema containing daily logs.

2. **FoodItem Schema**:
   - `name`: Name of the food item.
   - `brand`: Brand name.
   - `barcode`: Barcode number for identification.
   - `nutritionalInfo`: Object containing calories, protein, carbs, and fats.

3. **Caching**:
   - Cached product details from OpenFoodFacts.
   - Reduces redundant external API calls for improved performance.

## Deployment

NutriScan is deployed on platforms supporting Next.js, such as Vercel or AWS Amplify. Deployment steps include:

1. Build the application using `next build`.
2. Configure environment variables.
3. Deploy to the desired platform.

## Conclusion

NutriScan offers a robust and user-friendly platform for managing dietary habits. With its comprehensive features, advanced barcode scanning capabilities, and efficient database architecture, it provides an invaluable tool for health-conscious users.

