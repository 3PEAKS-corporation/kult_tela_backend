CREATE TABLE IF NOT EXISTS requests (
    id serial PRIMARY KEY,
    user_id INT NOT NULL,
    payment_id INT DEFAULT NULL,
    type INT NOT NULL,
    tutor VARCHAR DEFAULT NULL,
    date_from date NOT NULL ,
    date_to date NOT NULL ,
    date timestamp DEFAULT current_timestamp
);