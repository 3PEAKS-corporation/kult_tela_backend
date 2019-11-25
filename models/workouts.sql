CREATE TABLE IF NOT EXISTS workouts (
    id serial PRIMARY KEY,
    type INT NOT NULL,
    name VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    video_src VARCHAR DEFAULT NULL
);