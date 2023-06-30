-- Write your migrate up statements here
ALTER TABLE rulesets
ADD COLUMN description TEXT DEFAULT 'Your description here...';

---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.

ALTER TABLE rulesets
DROP COLUMN description;