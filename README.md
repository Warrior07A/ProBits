# CodeBridge - Real-Time Collaborative Interview Platform

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Warrior07A/CodeBridge)

**CodeBridge** is a next-generation, real-time collaborative platform engineered to elevate the technical interview and pair programming experience. By providing a synchronized, interactive workspace, it seamlessly bridges the gap between interviewers and candidates. Featuring blazing-fast code synchronization powered by the Monaco Editor, secure remote code execution, a shared live terminal, and integrated video streaming, CodeBridge delivers a frictionless, immersive environment for evaluating technical agility and collaborating on complex algorithms.

## Key Features

-   **Real-Time Code Collaboration**: Utilizes the Monaco Editor (the editor powering VS Code) and WebSockets to sync code changes and cursor movements between participants instantly.
-   **Session Management**: Teachers can create unique, shareable interview rooms. Students can join these rooms using a specific Room ID.
-   **Secure Authentication**: User registration and login system using JWT for securing API routes and WebSocket connections.
-   **Remote Code Execution**: Integrated with Judge0 API to securely compile and run code written in the editor, with the output displayed in a shared terminal.
-   **Live Terminal**: An embedded Xterm.js terminal displays the output of code execution to both the interviewer and the candidate in real-time.
-   **Video Streaming**: A placeholder component for WebRTC-based video communication between participants.

## Technology Stack

The project is a monorepo containing a separate frontend and backend.

### Backend

| Technology       | Purpose                                       |
| ---------------- | --------------------------------------------- |
| **Bun**          | JavaScript runtime and toolkit.               |
| **Express.js**   | Web framework for building the REST API.      |
| **WebSocket**    | For real-time bi-directional communication.   |
| **Prisma**       | Next-generation ORM for database access.      |
| **PostgreSQL**   | Relational database for storing user and room data. |
| **JWT**          | For generating and verifying authentication tokens. |
| **Zod**          | For schema validation of API requests.        |

### Frontend

| Technology                  | Purpose                               |
| --------------------------- | ------------------------------------- |
| **Bun**                     | Runtime, bundler, and package manager. |
| **React**                   | UI library for building the interface. |
| **Monaco Editor**           | The core collaborative code editor.   |
| **Xterm.js**                | For the integrated terminal display.  |
| **Tailwind CSS**            | For utility-first styling.            |
| **shadcn/ui**               | Re-usable UI components.              |
| **Axios**                   | For making HTTP requests to the backend. |

## Project Structure

```
.
├── Backend/        # Contains the backend server logic
│   ├── routes/     # REST API endpoints (auth, rooms)
│   ├── socket/     # WebSocket server and event handling
│   ├── prisma/     # Prisma schema, migrations, and client setup
│   └── Types/      # Zod schemas for validation
└── Frontend/       # Contains the React client application
    ├── src/
    │   ├── Pages/      # Main application pages (Dashboard)
    │   ├── components/ # React components (Editor, Terminal, Video)
    │   └── lib/        # Utility functions
    └── styles/       # Global CSS and Tailwind setup
```

## Setup and Installation

### Prerequisites

-   [Bun](https://bun.sh/)
-   A PostgreSQL database instance (you can get a free one from [Neon](https://neon.tech/))

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd Backend
    ```

2.  **Create an environment file:**
    Create a `.env` file in the `Backend` directory and add your database connection string and a JWT secret.

    ```env
    # .env
    DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
    JWT_SECRET="your-super-secret-key"
    ```

3.  **Install dependencies:**
    ```bash
    bun install
    ```

4.  **Run database migrations:**
    This will set up the necessary tables in your PostgreSQL database based on the `prisma/schema.prisma` file.
    ```bash
    bunx prisma migrate dev
    ```

5.  **Start the servers:**
    The backend consists of two services: the REST API server and the WebSocket server. Run them in separate terminal windows.

    *   **Start the REST API server (on port 3001):**
        ```bash
        bun run routes/index.ts
        ```

    *   **Start the WebSocket server (on port 8080):**
        ```bash
        bun run socket/ws.ts
        ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd Frontend
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Start the development server:**
    The React application will be available at `http://localhost:3000`.
    ```bash
    bun dev
    ```

## How It Works

1.  **Authentication**: Users sign up and log in as either a 'teacher' or 'student'. A successful login returns a JWT, which is stored in `localStorage` and sent with subsequent requests.
2.  **Room Creation**: A logged-in teacher can click "Create Room". This sends a `POST` request to `/teacher/createroom`, which creates a new room record in the database and returns a unique `roomId`.
3.  **Joining a Room**: A student (or the teacher) can enter the `roomId` and click "Join Room". This sends a `PUT` request to `/user/join`, updating the room record with the student's ID.
4.  **WebSocket Connection**: Upon entering the dashboard, each client establishes a WebSocket connection. When joining a room, the client sends a `JOIN_ROOM` message to the WebSocket server, which adds the client's connection to a set associated with that `roomId`.
5.  **Real-Time Sync**:
    -   When a user types in the Monaco editor, the new code is sent to the WebSocket server via a `CODE_SEND` message.
    -   The server receives this message and broadcasts a `CODE_UPDATE` event to all other clients connected to the same `roomId`.
    -   The other clients receive this event and update the value of their editor, achieving real-time synchronization.
    -   A similar flow handles the real-time update of the terminal output after code execution.