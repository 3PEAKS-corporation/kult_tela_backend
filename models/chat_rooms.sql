CREATE TABLE IF NOT EXISTS chat_rooms (
  id serial PRIMARY KEY,
  user_ids INTEGER[] NOT NULL,
  last_seen_message_id INTEGER DEFAULT NULL,
  name VARCHAR DEFAULT NULL
);