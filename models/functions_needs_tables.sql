CREATE FUNCTION chat_messages_formatted() RETURNS TABLE(id int, user_id int, room_id int, text varchar, "time" varchar, "date" varchar, attachments jsonb[]) AS $$
    SELECT id, user_id, room_id, text,to_char(date::time, 'HH24:MI'), to_char(date, 'DD.MM.YYYY'), attachments  FROM chat_messages
$$ LANGUAGE SQL STABLE;