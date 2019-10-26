CREATE TABLE IF NOT EXISTS tokens (
  id serial PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR NOT NULL,
  expire_date DATE NOT NULL DEFAULT CURRENT_DATE + interval '31 days'
);