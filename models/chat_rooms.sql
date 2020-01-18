CREATE TABLE IF NOT EXISTS chat_rooms (
  id serial PRIMARY KEY,
  users jsonb[] DEFAULT NULL
);