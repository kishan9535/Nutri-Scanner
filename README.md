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

