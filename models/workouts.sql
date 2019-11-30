CREATE TABLE IF NOT EXISTS workouts (
    id serial PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    exercises_home INTEGER[],
    exercises_gym INTEGER[]
);