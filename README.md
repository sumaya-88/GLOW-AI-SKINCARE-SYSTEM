# GLOW AI Skincare System

A full-stack web application powered by AI for skincare analysis and product recommendations.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- **AI-Powered Skincare Analysis**: Uses AI algorithms to analyze skin concerns and suggest solutions.
- **User Authentication**: Secure login and registration system with JWT.
- **Skincare Product Recommendations**: Personalized skincare suggestions based on analysis results.
- **Chatbot Support**: AI-driven chatbot for skincare-related queries.
- **Responsive UI**: Built with React and Tailwind CSS for a responsive design.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI**: Custom AI models for skincare analysis
- **Deployment**: Can be deployed on platforms like Netlify (Frontend) and Render (Backend)

## Installation

### Prerequisites:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (if running locally)

### Step-by-Step Installation:

1. Clone the repository:
    ```bash
    git clone https://github.com/sumaya-88/GLOW-AI-SKINCARE-SYSTEM.git
    ```

2. Install dependencies for the **backend**:
    ```bash
    cd server
    npm install
    ```

3. Install dependencies for the **frontend**:
    ```bash
    cd ../client
    npm install
    ```

4. Set up environment variables:
    - Create a `.env` file in the **server** folder and add the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongo_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

5. Run the backend server:
    ```bash
    cd server
    npm run dev
    ```

6. Run the frontend server:
    ```bash
    cd ../client
    npm run dev
    ```

7. Visit your app in the browser:
    ```url
    http://localhost:3000
    ```

## Usage

Once the application is running, users can:
1. Sign up and log in using JWT authentication.
2. Upload their skincare-related images (if applicable) for AI analysis.
3. Receive personalized skincare product recommendations based on the analysis.
4. Interact with the chatbot for additional skincare advice.

## Contributing

We welcome contributions! Here's how you can help:
1. Fork this repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add your feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Create a pull request

Please make sure to follow the code style and ensure that tests are added for new features.

## License

Distributed under the MIT License. See `LICENSE` for more information.
