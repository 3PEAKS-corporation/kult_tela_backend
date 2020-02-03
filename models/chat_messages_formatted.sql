CREATE VIEW chat_messages_formatted AS
SELECT id,
   user_id,
   room_id,
   text,
   to_char(date::time, 'HH24:MI') as time,
   to_char(date, 'DD.MM.YYYY') as date,
   attachments
FROM chat_messages;