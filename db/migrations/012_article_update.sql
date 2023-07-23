-- Write your migrate up statements here
ALTER TABLE articles
ADD COLUMN is_folder BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN no_export BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN icon_name TEXT,
ADD COLUMN article_description TEXT;
---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
ALTER TABLE articles
DROP COLUMN is_folder,
DROP COLUMN no_export,
DROP COLUMN icon_name,
DROP COLUMN article_description;