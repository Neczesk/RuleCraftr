-- Write your migrate up statements here
ALTER TABLE users
ADD COLUMN last_version_used VARCHAR,
ADD COLUMN prefer_dark_mode BOOLEAN,
ADD COLUMN theme_preference TEXT DEFAULT 'cherry';

---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
ALTER TABLE users
DROP COLUMN last_version_used,
DROP COLUMN prefer_dark_mode,
DROP COLUMN theme_preference;