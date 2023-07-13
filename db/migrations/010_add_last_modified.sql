-- Write your migrate up statements here
ALTER TABLE rulesets
ADD COLUMN last_modified TIMESTAMPTZ NOT NULL DEFAULT (NOW() at time zone 'utc');

---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.

ALTER TABLE rulesets
DROP COLUMN last_modified;