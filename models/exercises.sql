CREATE TABLE IF NOT EXISTS exercises (
    id serial PRIMARY KEY,
    type INT NOT NULL,
    name VARCHAR NOT NULL,
    repetitions INTEGER DEFAULT 0,
    description VARCHAR NOT NULL,
    warning VARCHAR DEFAULT NULL,
    video_src VARCHAR DEFAULT NULL
);