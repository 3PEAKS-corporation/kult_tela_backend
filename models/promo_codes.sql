CREATE TABLE IF NOT EXISTS promo_codes (
    id serial PRIMARY KEY,
    key VARCHAR UNIQUE NOT NULL,
    infinite BOOLEAN DEFAULT FALSE,
    plan_id INTEGER NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    date_expire timestamp DEFAULT NULL,
    subscription_duration INTEGER DEFAULT NULL,
    date timestamp DEFAULT current_timestamp
);