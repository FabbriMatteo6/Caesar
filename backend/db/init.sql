-- DDL for Il Palazzo: The Italian Political Simulator

-- Table for player accounts
CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for geographical regions
CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    population INTEGER,
    gdp_per_capita INTEGER,
    base_approval DECIMAL(5, 2)
);

-- Table for individual game sessions
CREATE TABLE game_sessions (
    session_id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL REFERENCES players(player_id),
    turn_number INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    career_level VARCHAR(50),
    current_jurisdiction_id INTEGER REFERENCES regions(region_id),
    public_approval DECIMAL(5, 2),
    budget_balance BIGINT,
    political_capital INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Table for policies that can be enacted
CREATE TABLE policies (
    policy_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    effects JSONB -- e.g., {"public_approval": 5, "budget": -1000000}
);

-- Table for game events (random or consequence-based)
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    type VARCHAR(50), -- 'random', 'consequence'
    trigger_conditions JSONB,
    choices JSONB
);

-- Log table for all major decisions made by the player
CREATE TABLE decisions_log (
    decision_id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES game_sessions(session_id),
    turn_made INTEGER NOT NULL,
    action_type VARCHAR(100), -- 'enact_policy', 'handle_event'
    related_id INTEGER, -- e.g., policy_id or event_id
    description TEXT
);

-- Indexes for foreign keys to improve query performance
CREATE INDEX idx_game_sessions_player_id ON game_sessions(player_id);
CREATE INDEX idx_decisions_log_session_id ON decisions_log(session_id);
