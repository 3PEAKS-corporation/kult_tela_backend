CREATE TABLE IF NOT EXISTS hashes (
   id serial PRIMARY KEY,
   user_id INT NOT NULL,
   type VARCHAR NOT NULL,
   hash VARCHAR NOT NULL,
   code VARCHAR,
   payment_id INT DEFAULT NULL,
   used BOOLEAN NOT NULL DEFAULT FALSE,
   date timestamp DEFAULT current_timestamp
);
