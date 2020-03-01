CREATE TABLE IF NOT EXISTS  users(
    id SERIAL PRIMARY KEY ,

    admin_role_id INT DEFAULT NULL,

    email VARCHAR NOT NULL UNIQUE ,
    password VARCHAR ,
    first_name VARCHAR ,
    last_name VARCHAR ,
    patronymic VARCHAR ,
    date_signup TIMESTAMP DEFAULT current_timestamp,

    subscription_exp TIMESTAMP,

    height REAL,
    age INTEGER,
    
    weight_start REAL ,
    weight_history jsonb[] DEFAULT NULL,
    weight_diff REAL GENERATED ALWAYS AS (weight_start - (arr_last_item(weight_history)->>'weight')::real) STORED ,

    rank INTEGER GENERATED ALWAYS AS (calc_rank(weight_start, weight_start-(arr_last_item(weight_history)->>'weight')::real)) STORED,

    photos jsonb[] DEFAULT NULL,
    workout jsonb DEFAULT '{}',
    food_menu_id INTEGER DEFAULT NULL,
    food_reports jsonb[] DEFAULT NULL,
    
    notifications jsonb[] DEFAULT NULL,
    notifications_last_seen INT DEFAULT -1,

    history jsonb[] DEFAULT NULL,
    last_online TIMESTAMP DEFAULT NULL,
    
    avatar_src VARCHAR,
    plan_id INT DEFAULT NULL,
    tutor_id INT DEFAULT NULL
);