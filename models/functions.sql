CREATE OR REPLACE FUNCTION arr_length(arr jsonb[]) RETURNS integer AS $$
SELECT COALESCE(array_length(arr, 1), 0)
$$
LANGUAGE sql
IMMUTABLE;

