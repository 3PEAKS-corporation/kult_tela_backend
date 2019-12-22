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
   WHEN percent BETWEEN 13.0 AND 17.0 THEN
         rank = 2;
   WHEN percent BETWEEN 17.0 AND 20.0 THEN
         rank = 3;
   WHEN percent BETWEEN 20.0 AND 23.0 THEN
         rank = 4;
   WHEN percent BETWEEN 23.0 AND 27.0 THEN
			rank = 5;
   WHEN percent BETWEEN 27.0 AND 33.0 THEN
			rank = 6;
   WHEN percent BETWEEN 33.0 AND 35.0 THEN
			rank = 7;
   WHEN percent BETWEEN 35.0 AND 40.0 THEN
			rank = 8;
   WHEN percent BETWEEN 40.0 AND 50.0 THEN
			rank = 9;
   WHEN percent BETWEEN 50.0 AND 100.0 THEN
         rank = 10;
   ELSE
    	  	rank = 0;
   END CASE;

   RETURN rank;
END; $$ LANGUAGE plpgsql IMMUTABLE;