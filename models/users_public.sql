CREATE OR REPLACE VIEW users_public AS
SELECT  id,
    first_name || ' ' || last_name as name,
    plan_id,
    weight_start,
    rank,
    avatar_src,
    admin_role_id,
    (weight_start - COALESCE(weight_diff, 0)) as weight_current,
    to_char(date_signup,'DD.MM.YYYY') as date_signup
FROM users;