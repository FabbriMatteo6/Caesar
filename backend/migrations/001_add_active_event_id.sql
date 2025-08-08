-- Migration to add a column for tracking the active event in a game session.

ALTER TABLE game_sessions
ADD COLUMN active_event_id INTEGER NULL REFERENCES events(event_id);

-- Add an index for faster lookups on the new column.
CREATE INDEX idx_game_sessions_active_event_id ON game_sessions(active_event_id);
