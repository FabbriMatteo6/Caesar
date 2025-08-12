-- Migration to add a column for storing budget allocation details.

ALTER TABLE game_sessions
ADD COLUMN budget_allocations JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Add a comment to the new column for clarity on its purpose.
COMMENT ON COLUMN game_sessions.budget_allocations IS 'Stores key-value pairs for budget allocations, e.g., {"healthcare": 40, "education": 30, "infrastructure": 30}';
