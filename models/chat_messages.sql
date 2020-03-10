CREATE TABLE IF NOT EXISTS chat_messages (
  id serial PRIMARY KEY,
  user_id INTEGER NOT NULL,
  room_id INTEGER NOT NULL,
  text VARCHAR,
  attachments jsonb[] DEFAULT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);