CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY ,
    email VARCHAR NOT NULL UNIQUE ,
    password VARCHAR ,
    first_name VARCHAR ,
    last_name VARCHAR ,
    patronymic VARCHAR ,
    weight_start REAL ,
    weight_history jsonb[] ,
    avatar_src VARCHAR,
    plan_id INT DEFAULT NULL
);