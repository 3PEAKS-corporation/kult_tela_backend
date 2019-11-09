CREATE OR REPLACE FUNCTION arr_length(arr jsonb[]) RETURNS integer AS $$
SELECT COALESCE(array_length(arr, 1), 0)
$$ LANGUAGE sql IMMUTABLE;


CREATE OR REPLACE FUNCTION arr_last_item(arr jsonb[]) RETURNS jsonb AS $$
SELECT arr[array_upper(arr, 1)];
$$ LANGUAGE sql IMMUTABLE;

CREATE OR REPLACE FUNCTION calc_rank(w_start real, w_diff real) RETURNS integer AS $$
DECLARE
   start_weight   numeric :=w_start;
   diff_weight  numeric :=w_diff;
   percent numeric;
   rank integer;
BEGIN
	percent:=start_weight/100.0*diff_weight;

   CASE
   WHEN percent BETWEEN 8.0 AND 13.0 THEN
            rank = 1;
   WHEN percent BETWEEN 13.0 AND 16.0 THEN
            rank = 2;
   WHEN percent BETWEEN 16.0 AND 19.0 THEN
            rank = 3;
   WHEN percent BETWEEN 19.0 AND 23.0 THEN
            rank = 4;
   WHEN percent BETWEEN 23.0 AND 26.0 THEN
			rank = 5;
   WHEN percent BETWEEN 26.0 AND 31.0 THEN
			rank = 6;
   WHEN percent BETWEEN 31.0 AND 100.0 THEN
			rank = 7;
   ELSE
    	  	rank = 0;
   END CASE;

   RETURN rank;
END; $$ LANGUAGE plpgsql IMMUTABLE;