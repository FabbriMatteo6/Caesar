# Technical Architecture Document: Il Palazzo

## 1. Proposed Technology Stack

To build a robust, scalable, and interactive web application for "Il Palazzo," the following technology stack is proposed:

*   **Frontend: React**
    *   **Reasoning:** React's component-based architecture is ideal for building a complex and dynamic user interface like a game dashboard. Its strong ecosystem (including state management libraries like Redux or Zustand) allows for efficient handling of the game's state (e.g., resources, events, player info).

*   **Backend: Node.js with Express.js**
    *   **Reasoning:** Node.js is a non-blocking, event-driven runtime, which makes it highly suitable for managing the game's turn-based logic and real-time updates. Express.js provides a minimalist and flexible framework for building the required RESTful API to connect the frontend and backend.

*   **Database: PostgreSQL**
    *   **Reasoning:** PostgreSQL is a powerful, open-source object-relational database system known for its reliability, feature robustness, and performance. Its relational nature is perfect for modeling the structured data of the game, such as player states, policies, and historical decisions. The support for JSONB is also a major advantage for storing semi-structured data like policy effects.

## 2. Frontend Architecture (React)

The frontend will be a Single Page Application (SPA) built with React. State management will be handled by a global state library (e.g., Zustand or Redux Toolkit) to provide a single source of truth for the game state.

### Key UI Components:

*   **`MainDashboard.js`**
    *   **Description:** This is the central hub of the game. It will be a persistent view that displays the player's core statistics (Public Approval, Budget, Political Capital) in real-time. It also contains a news feed/ticker that shows recent events and headlines.
    *   **Data:** Subscribes to the global game state for stats. Fetches news items from the API.
    *   **Children:** `StatsDisplay`, `NewsTicker`, `ActionToolbar`.

*   **`MapView.js`**
    *   **Description:** An interactive map of Italy, rendered using a library like Leaflet or Mapbox. The view will be context-sensitive, showing the player's current jurisdiction (town, region, or the whole country). Data overlays will visualize key information, such as public approval by region, economic status, or areas affected by an event.
    *   **Data:** GeoJSON data for Italian administrative borders. Dynamic data from the API for overlays.

*   **`EventModal.js`**
    *   **Description:** A modal (pop-up) component that interrupts gameplay to present an event to the player. It will display the event description and provide 2-3 decision options. The player's choice will be sent to the backend to be processed.
    *   **Data:** Receives event data (title, description, choices) as props.

*   **`LegislationView.js`**
    *   **Description:** A dedicated screen where players can browse existing laws, propose new legislation, and view the status of ongoing votes. It will show the details of each law, including its projected effects on the core resources.
    *   **Data:** Fetches a list of proposable and existing laws from the API.

*   **`BudgetView.js`**
    *   **Description:** An interface for managing the budget. It will feature sliders or input fields for adjusting tax rates and allocating funds across different government sectors (e.g., healthcare, education, military).
    *   **Data:** Fetches and displays the current budget from the API. Player changes are sent back for processing.

## 3. Backend Architecture (Node.js/Express)

The backend will be responsible for the core game logic, data persistence, and player authentication.

### API Design (RESTful)

The API will expose endpoints for the frontend to interact with the game world. All endpoints will be prefixed with `/api`.

*   **Authentication:**
    *   `POST /auth/register`: Create a new player account.
    *   `POST /auth/login`: Log in and receive a session token (JWT).
*   **Game State:**
    *   `GET /game/state`: Fetches the complete current game state for the logged-in player.
    *   `POST /game/new`: Starts a new game.
*   **Player Actions:**
    *   `POST /actions/legislate`: Propose or vote on a law. Body: `{ "policyId": "...", "action": "propose/support/veto" }`.
    *   `POST /actions/public_engagement`: Perform a public action. Body: `{ "type": "speech/press_conference/social_media" }`.
    *   `POST /actions/negotiate`: Initiate a negotiation.
    *   `POST /actions/budget`: Submit new budget allocations. Body: `{ "allocations": { ... } }`.
*   **End of Turn:**
    *   `POST /game/end_turn`: The player signals they are ready to advance to the next turn.

### Game Engine Logic

The core of the backend is the game engine, which processes game progression.

*   **Turn-Based System:** The game progresses in turns, where each turn represents one month.
*   **Processing Loop:** When the player calls `POST /game/end_turn`, the server-side game engine will:
    1.  **Process Player Actions:** Calculate the immediate effects of all actions the player took during the turn.
    2.  **Update Core Resources:** Modify Public Approval, Budget, and Political Capital based on the actions and underlying economic simulations.
    3.  **Trigger Events:** Check for conditions to trigger consequence-based events. Run a probability check for random events.
    4.  **Update World State:** Simulate changes in the game world (e.g., demographic shifts, economic trends).
    5.  **Persist State:** Save the new `game_state` to the database.
    6.  **Return New State:** Send the updated game state back to the client, which may include a new event to be displayed in the `EventModal`.

### Authentication

*   **Method:** A simple, secure authentication system using JSON Web Tokens (JWT).
*   **Flow:**
    1.  Player logs in with `username` and `password`.
    2.  Server validates credentials and issues a signed JWT.
    3.  The JWT is stored on the client (e.g., in `localStorage`).
    4.  Every subsequent API request from the client must include the JWT in the `Authorization` header.
    5.  A middleware on the server verifies the token on each request to identify and authenticate the player.

## 4. Database Schema (PostgreSQL)

The database will store all player data, game states, and game content.

*   **`players`**
    *   `player_id` (SERIAL, PRIMARY KEY)
    *   `username` (VARCHAR(50), UNIQUE, NOT NULL)
    *   `password_hash` (VARCHAR(255), NOT NULL)
    *   `created_at` (TIMESTAMP, DEFAULT NOW())

*   **`game_sessions`**
    *   `session_id` (SERIAL, PRIMARY KEY)
    *   `player_id` (INTEGER, FOREIGN KEY to `players.player_id`)
    *   `turn_number` (INTEGER, NOT NULL, DEFAULT 0)
    *   `is_active` (BOOLEAN, DEFAULT TRUE)
    *   `career_level` (VARCHAR(50)) -- e.g., 'Sindaco', 'PresidenteRegione'
    *   `current_jurisdiction_id` (INTEGER) -- FK to `regions.region_id` or a new `towns` table
    *   **Core Resources:**
        *   `public_approval` (DECIMAL(5, 2))
        *   `budget_balance` (BIGINT)
        *   `political_capital` (INTEGER)
    *   `created_at` (TIMESTAMP, DEFAULT NOW())
    *   `updated_at` (TIMESTAMP)

*   **`policies`**
    *   `policy_id` (SERIAL, PRIMARY KEY)
    *   `name` (VARCHAR(255), NOT NULL)
    *   `description` (TEXT)
    *   `category` (VARCHAR(50)) -- 'Economy', 'Social', etc.
    *   `effects` (JSONB) -- Stores the effects, e.g., `{"public_approval": 5, "budget": -1000000}`

*   **`decisions_log`**
    *   `decision_id` (SERIAL, PRIMARY KEY)
    *   `session_id` (INTEGER, FOREIGN KEY to `game_sessions.session_id`)
    *   `turn_made` (INTEGER, NOT NULL)
    *   `action_type` (VARCHAR(100)) -- 'enact_policy', 'handle_event'
    *   `related_id` (INTEGER) -- e.g., `policy_id` or `event_id`
    *   `description` (TEXT) -- e.g., "Player enacted 'Green Energy Subsidies' policy."

*   **`regions`**
    *   `region_id` (SERIAL, PRIMARY KEY)
    *   `name` (VARCHAR(100), NOT NULL)
    *   `population` (INTEGER)
    *   `gdp_per_capita` (INTEGER)
    *   `base_approval` (DECIMAL(5, 2))

*   **`events`**
    *   `event_id` (SERIAL, PRIMARY KEY)
    *   `name` (VARCHAR(255))
    *   `description` (TEXT)
    *   `type` (VARCHAR(50)) -- 'random', 'consequence'
    *   `trigger_conditions` (JSONB) -- Conditions for the event to occur.
    *   `choices` (JSONB) -- The decision options and their effects.
