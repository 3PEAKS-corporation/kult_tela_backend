CREATE TABLE IF NOT EXISTS  users(
    id SERIAL PRIMARY KEY ,
    email VARCHAR NOT NULL UNIQUE ,
    password VARCHAR ,
    first_name VARCHAR ,
    last_name VARCHAR ,
    patronymic VARCHAR ,
    date_signup TIMESTAMP DEFAULT current_timestamp,

    height REAL,

    weight_start REAL ,
    weight_history jsonb[] DEFAULT NULL,
    weight_diff REAL GENERATED ALWAYS AS (weight_start - (arr_last_item(weight_history)->>'weight')::real) STORED ,

    rank INTEGER GENERATED ALWAYS AS (calc_rank(weight_start, weight_start-(arr_last_item(weight_history)->>'weight')::real)) STORED,

    photos jsonb[] DEFAULT NULL,
    workout jsonb DEFAULT NULL,
    food jsonb DEFAULT NULL,
    payments jsonb[] DEFAULT NULL,
    
    notifications jsonb[] DEFAULT NULL,
    notifications_last_seen INT DEFAULT -1,
    
    avatar_src VARCHAR,
    plan_id INT DEFAULT NULL
);