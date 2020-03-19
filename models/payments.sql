CREATE TABLE IF NOT EXISTS payments (
  id serial PRIMARY KEY,
  user_id INT NOT NULL,
  key VARCHAR UNIQUE DEFAULT NULL,
  status VARCHAR DEFAULT NULL,
  type VARCHAR DEFAULT NULL,
  value REAL NOT NULL,
  date timestamp DEFAULT current_timestamp
);