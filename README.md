# Anno-Text: Anonymous Feedback Platform Documentation

## Overview

Anno-Text is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that provides a platform for anonymous feedback. Users can sign up, create profiles, and receive anonymous messages from others. The platform aims to foster open and honest communication while maintaining user privacy.

## Table of Contents

- [Frontend](#frontend)
  - [Technologies Used](#frontend-technologies-used)
  - [Project Structure](#frontend-project-structure)
  - [Key Components](#frontend-key-components)
  - [UI Library](#ui-library)
  - [State Management](#state-management)
  - [Authentication](#frontend-authentication)
  - [Environment Variables](#frontend-environment-variables)
- [Backend](#backend)
  - [Technologies Used](#backend-technologies-used)
  - [Project Structure](#backend-project-structure)
  - [Models](#backend-models)
  - [Routes/APIs](#backend-routesapis)
  - [Database Connection](#database-connection)
  - [Authentication](#backend-authentication)
  - [Middleware](#backend-middleware)
  - [Environment Variables](#backend-environment-variables)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Frontend

The frontend is built using Next.js, a React framework that enables features like server-side rendering and static site generation.

### Technologies Used

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Radix UI
-   Zod
-   Axios
-   NextAuth.js
-   usehooks-ts
-   Sonner
-   Lucide React
-   Embla Carousel

### Project Structure

```
src/
├── app/             # Next.js routing and page components
├── components/      # Reusable UI components
├── context/         # React context providers
├── lib/             # Utility functions and configurations
├── model/           # Data models
├── schemas/         # Zod schemas for form validation
├── types/           # TypeScript types
├── messages.json    # JSON file containing messages
└── app/globals.css  # Global CSS file
```

### Key Components

-   **Navbar:** Navigation bar with login, signup, logout, and theme toggle.
-   **Home Page:** Displays a carousel of messages and a brief introduction to the platform.
-   **Sign-up Page:** Allows users to create a new account.
-   **Sign-in Page:** Allows users to log in to their existing account.
-   **Dashboard:** User dashboard to manage messages and settings.
-   **User Profile Page:** Public profile page where users can receive anonymous messages.
-   **UI Components:** Reusable UI components built with Radix UI and Tailwind CSS.

### UI Library

-   **Radix UI:** Used for accessible and unstyled UI primitives.
-   **Tailwind CSS:** Used for styling the components.

### State Management

-   **React Context:** Used for managing authentication state.
-   **useState:** Used for managing local component state.

### Authentication

-   **NextAuth.js:** Used for handling user authentication.
    -   Supports Google and Credentials (username/password) authentication.
    -   JWT (JSON Web Tokens) are used for session management.

### Environment Variables

-   `AUTH_SECRET`: Secret key for NextAuth.js.
-   `NEXT_PUBLIC_BASE_URL`: Base URL of the application.

## Backend

The backend is built using Node.js, Express.js, and MongoDB.

### Technologies Used

-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   bcrypt
-   NextAuth.js
-   Zod
-   Resend
-   Google Generative AI

### Project Structure

```
src/
├── app/             # Next.js routing and page components
├── lib/             # Utility functions and configurations
├── model/           # Data models
├── schemas/         # Zod schemas for validation
└── app/api          # API routes
```

### Models

-   **User:** Represents a user account.
    -   `username` (String, required, unique)
    -   `email` (String, required, unique)
    -   `password` (String, required)
    -   `verifyCode` (String, required)
    -   `isVerified` (Boolean, default: false)
    -   `verifyCodeExpiry` (Date, required)
    -   `isAcceptingMsg` (Boolean, required)
    -   `messages` (Array of Message objects)
-   **Message:** Represents a message.
    -   `content` (String, required)
    -   `createdAt` (Date, default: Date.now)

### Routes/APIs

-   `/api/sign-up`: Registers a new user.
-   `/api/account-verification`: Verifies a user's account using a verification code.
-   `/api/sign-in`: Logs in an existing user.
-   `/api/auth/[...nextauth]`: NextAuth.js route for handling authentication.
-   `/api/unique-username`: Checks if a username is unique.
-   `/api/send-message`: Sends an anonymous message to a user.
-   `/api/accept-messages`: Manages user's message acceptance settings.
-   `/api/get-messages`: Retrieves messages for a user.
    -   `/api/suggest-ai-msg`: Suggests messages using Google Gemini AI.

### Database Connection

-   **MongoDB:** Used as the database.
-   **Mongoose:** Used for interacting with MongoDB.
-   `dbConnect.ts`: Manages the database connection.

### Authentication

-   **NextAuth.js:** Used for handling user authentication.
    -   Credentials are used to verify the user.
    -   JWT (JSON Web Tokens) are used for session management.

### Middleware

-   `middleware.ts`: Protects routes based on user authentication status.

### Environment Variables

-   `MONGODB_URI`: URI for connecting to MongoDB.
-   `AUTH_SECRET`: Secret key for NextAuth.js.
-   `GOOGLE_CLIENT_ID`: Google OAuth client ID.
-   `GOOGLE_CLIENT_SECRET`: Google OAuth client secret.
-   `RESEND_API_KEY`: API key for Resend email service.
    -   `GEMINI_API_KEY`: API key for Google Gemini AI service.

## Setup and Installation

### Prerequisites

-   Node.js (>=18)
-   npm or yarn
-   MongoDB
-   Resend account (for sending emails)
-   Google Cloud Account (for Google Gemini AI)

### Installation Steps

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3.  Set up environment variables:

    -   Create a `.env.local` file in the project root.
    -   Add the following environment variables:

        ```
        MONGODB_URI=<your_mongodb_uri>
        AUTH_SECRET=<your_auth_secret>
        GOOGLE_CLIENT_ID=<your_google_client_id>
        GOOGLE_CLIENT_SECRET=<your_google_client_secret>
        RESEND_API_KEY=<your_resend_api_key>
        GEMINI_API_KEY=<your_gemini_api_key>
        NEXT_PUBLIC_BASE_URL=<your_base_url>
        ```

4.  Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  Open your browser and navigate to `http://localhost:3000`.

## Deployment

The application can be deployed to platforms like Vercel, Netlify, or Heroku. Ensure that the environment variables are properly configured in the deployment environment.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch.
3.  Make your changes.
4.  Submit a pull request.

## License

[MIT](LICENSE)
