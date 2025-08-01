# SnippetSage 

**Reuse. Refactor. Redefine. Your personal AI-powered code snippet manager.**

SnippetSage is a modern, full-stack web application designed to help developers save, manage, and discover code snippets intelligently. Gone are the days of losing valuable code in scattered files and notes. With SnippetSage, your code is organized, easily searchable, and enhanced with the power of AI.

## About The Project

As developers, we constantly write and rewrite code. SnippetSage was built to solve a common problem: keeping track of useful code snippets in an organized and accessible way. It's more than just a storage tool; it's a smart companion that understands the *meaning* of your code, allowing you to find what you need, when you need it.

This project is built with a modern tech stack, featuring a React/TypeScript frontend and a robust Node.js/Express backend, and leverages a vector database for cutting-edge semantic search capabilities.

### Key Features

* **Full CRUD for Snippets:** Create, Read, Update, and Delete your code snippets with ease.
* **AI-Powered Semantic Search:** Search by concept, not just keywords. Find functionally similar code even if the wording is different, powered by Pinecone's vector database.
* **Blazing Fast Caching:** Frequently accessed snippets and searches are cached with Redis for a snappy user experience.
* **Secure User Authentication:** A complete authentication system with JWT and refresh tokens to keep your snippets safe.
* **Optimistic UI Updates:** A seamless frontend experience where new snippets appear instantly, built with Redux Toolkit.
* **Responsive & Modern UI:** A beautiful and intuitive interface built with Tailwind CSS and shadcn/ui.

### Upcoming Features

* **AI Code Explanation:** Get a natural language explanation of your code.
* **AI Code Translation:** Translate snippets between different programming languages.
* **Snippet Collections:** Organize your snippets into folders and collections.
* **Bulk Import:** Upload multiple snippets at once.

## Tech Stack

**Frontend:**

* React & Vite
* TypeScript
* Redux Toolkit & RTK Query
* Tailwind CSS
* shadcn/ui

**Backend:**

* Node.js & Express
* TypeScript
* MongoDB & Mongoose
* Pinecone (Vector Database)
* Redis (Caching)
* JWT (Authentication)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or higher)
* npm
* MongoDB instance
* Redis instance
* Pinecone API Key

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/briankim06/snippetsage.git](https://github.com/briankim06/snippetsage.git)
    cd snippetsage
    ```
2.  **Install Backend Dependencies**
    ```sh
    cd backend
    npm install
    ```
3.  **Install Frontend Dependencies**
    ```sh
    cd ../frontend
    npm install
    ```
4.  **Set up Environment Variables**

    Create a `.env` file in the `backend` directory and add the following:
    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    PINECONE_API_KEY=your_pinecone_api_key
    PINECONE_INDEX_NAME=your_pinecone_index_name

    # Upstash Redis environment variables
    UPSTASH_REDIS_REST_URL=your_upstash_url
    UPSTASH_REDIS_REST_TOKEN=your_upstash_token
    ```

### Usage

1.  **Run the Backend Server**
    ```sh
    # From the /backend directory
    npm run dev
    ```
    The server will start on `http://localhost:5001`.

2.  **Run the Frontend Development Server**
    ```sh
    # From the /frontend directory
    npm run dev
    ```
    The application will be available at `http://localhost:5174`.
