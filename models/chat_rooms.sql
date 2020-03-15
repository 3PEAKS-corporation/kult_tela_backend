CREATE TABLE IF NOT EXISTS chat_rooms (
  id serial PRIMARY KEY,
  user_ids INTEGER[] DEFAULT '{}',
  last_seen_message_id INTEGER DEFAULT NULL,
  name VARCHAR DEFAULT NULL,
  conversation BOOLEAN DEFAULT FALSE,
  image_src VARCHAR DEFAULT NULL
);
INSERT INTO chat_rooms(name, conversation) VALUES('Курилка за казармой', true);
INSERT INTO chat_rooms(name, conversation) VALUES ('Общий чат с диетологом', true);