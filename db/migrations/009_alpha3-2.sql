-- Write your migrate up statements here
ALTER TABLE keywords
ADD COLUMN dummy BOOL DEFAULT false;
---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
ALTER TABLE keywords DROP COLUMN dummy;