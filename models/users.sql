CREATE  TABLE IF NOT EXISTS  users(
    id SERIAL PRIMARY KEY ,
    email VARCHAR NOT NULL UNIQUE ,
    password VARCHAR ,
    first_name VARCHAR ,
    last_name VARCHAR ,
    patronymic VARCHAR ,
    date_signup TIMESTAMP DEFAULT current_timestamp,

    weight_start REAL ,
    weight_diff REAL GENERATED ALWAYS AS (weight_start - (arr_last_item(weight_history)->>'weight')::real) STORED ,
    weight_history jsonb[] ,

    avatar_src VARCHAR,
    plan_id INT DEFAULT NULL
);