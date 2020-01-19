CREATE TABLE IF NOT EXISTS chat_rooms (
  id serial PRIMARY KEY,
  user_ids INTEGER[] NOT NULL,
  second_is_admin BOOLEAN DEFAULT FALSE,
  last_seen_message_id INTEGER DEFAULT NULL
);