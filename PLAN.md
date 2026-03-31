# Architecture & Development Plan: ProBits Collaborative Interview Platform

Based on the reference image provided, you are building a professional, LeetCode-style real-time interview platform. This document outlines the architecture, required technologies, and a structured learning plan to build this from V0.

---

## 1. Visual Layout & Component Architecture

Your target UI is a highly functional, multi-pane dark-mode interface. Here is how we should break down the components:

### A. Top Navigation Bar (Header)
*   **Elements**: Branding/Logo, Session ID, Active Timer, Interview Title (e.g., "Senior Engineer - L5 Interview"), and a primary "End Session" button.

### B. Left Panel: Problem Context (Two-Column sub-layout)
*   **Far-Left Navigation**: A list of algorithms/topics (Arrays, Sliding Window, Binary Search) with completion indicators.
*   **Problem Details Pane**:
    *   **Tabs**: "Problem", "Solution", "Hints".
    *   **Content**: Markdown-rendered text for the Problem Description, Examples (with inputs/outputs), and Constraints.

### C. Center Panel: The IDE & Execution Output
*   **Top IDE Section**: 
    *   Tool bar with a Language Selector (e.g., Python 3), reset code, and editor settings.
    *   The Code Editor itself with syntax highlighting for the selected language.
*   **Bottom Output Section (Resizable)**:
    *   A "Run Code" button.
    *   Test case results showing detailed metrics: Overall pass/fail (`3/3 Passed`), Runtime (e.g., `48 ms`), Memory usage (e.g., `17.4 MB`).
    *   Individual test case drop-downs showing expected vs actual output.

### D. Right Panel: Video & Collaboration
*   **Participants List**: Vertical stack of video cards (Interviewer and Candidate).
*   **Video Controls**: Bottom bar for Mic, Camera, and Screen Share toggles.

---

## 2. Technology Stack & Required Skills

To achieve this specific platform, here are the technologies you must learn and utilize:

### Frontend (User Interface)
*   **Framework**: **React.js** (or Next.js). Essential for managing the complex state across all these different panels.
*   **Styling**: **Tailwind CSS**. Highly recommended to achieve the sleek, dark-mode styling and complex flexbox/grid layouts seen in the image.
*   **Code Editor Component**: **Monaco Editor** (`@monaco-editor/react`). This gives you the exact look, feel, and minimap capability seen in your image.
*   **Resizable Panes**: A library like `react-resizable-panels` to allow the user to drag and resize the terminal vs the IDE.

### Real-Time Collaboration (The "Live" Aspect)
*   **Code Synchronization**: **Yjs** paired with WebSockets (`y-websocket`). Yjs is a CRDT (Conflict-free Replicated Data Type) library that plugs directly into Monaco Editor. This allows both the Interviewer and Candidate to type simultaneously with zero conflicts, showing colored cursors with names.

### Code Execution & Test Cases (Crucial for this design)
Because your image shows exact Runtime (48ms) and Memory (17.4MB) along with specific test cases, a simple terminal output isn't enough.
*   **Engine**: **Judge0 API**. Judge0 specializes in competitive programming execution. You send it the code + the expected inputs/outputs for test cases, and it returns whether they passed, failed, and exact runtime/memory stats.
*   **Local Alternative**: If building your own, you would need a Node.js backend executing Docker containers, measuring the process stats, which is quite advanced. Using an API like Judge0 is strongly recommended for V0.

### Video / Audio Streaming
*   **Technology**: **WebRTC** via a managed service like **LiveKit** or **Agora**. Doing raw WebRTC is very hard. LiveKit provides React components (`<VideoTrack />`) that make stacking the interviewer/candidate videos very straightforward.

### Backend & Database
*   **Server**: **Node.js + Express**. To create secure interview "Rooms," generate API tokens for the video service, and proxy requests to Judge0.
*   **Database**: **PostgreSQL** or **MongoDB**. Required to store the catalog of LeetCode-style questions, test cases for those questions, and user authentication.

---

## 3. Step-by-Step Development Plan (The "Learning Approach")

Do not try to build the entire dashboard at once. Follow this modular progression:

### Phase 1: The UI Skeleton & Dark Theme
*   **Goal**: Recreate the static HTML/CSS layout of the image without any functionality.
*   **Tasks**: Build the Header, the 3 main columns, and style them closely matching the dark theme using Tailwind. Put fake text everywhere.
*   **Learning**: Advanced Flexbox, CSS Grid, React component decoupling.

### Phase 2: The IDE Component
*   **Goal**: Get Monaco editor rendering in the center panel.
*   **Tasks**: Integrate `@monaco-editor/react`. Hook up a predefined code snippet for a "Two Sum" problem. Add the language dropdown that changes the editor's language mode.
*   **Learning**: Third-party library integration, React state hooks.

### Phase 3: Problem Rendering
*   **Goal**: Make the left panel dynamic.
*   **Tasks**: Use `react-markdown` to render a JSON object containing a problem description. Build the functional UI tabs for Problem/Solution/Hints.
*   **Learning**: Data-driven UI, rendering markdown safely.

### Phase 4: Code Execution Engine
*   **Goal**: Make the "Run Code" button work.
*   **Tasks**: Send the code from the Monaco editor to the Judge0 API (or similar). Parse the response to extract Runtime, Memory, and Test Status, and display them in the bottom output panel.
*   **Learning**: Asynchronous JS (`fetch` or `axios`), API integration, error handling.

### Phase 5: Real-time Code Sync
*   **Goal**: Make the IDE collaborative.
*   **Tasks**: Spin up a simple WebSocket server. Integrate Yjs with the Monaco editor so two different browsers updating the exact same session ID can see each other's cursors.
*   **Learning**: WebSockets, CRDTs, event-driven web.

### Phase 6: Video Conference Integration
*   **Goal**: Add the live video stack on the right.
*   **Tasks**: Integrate LiveKit/Agora. Request microphone and camera permissions. Render local and remote video tracks in the placeholders. Add toggle buttons for muting/unmuting.
*   **Learning**: Browser Media APIs, WebRTC concepts.

### Phase 7: Polish & The Timer
*   **Goal**: Tie the session together.
*   **Tasks**: Make the session timer functional. Ensure all components use a single "Room ID" from the URL parameters to connect to the right video room and the right code document.
