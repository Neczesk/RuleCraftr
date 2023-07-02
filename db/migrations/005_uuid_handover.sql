-- Write your migrate up statements here
TRUNCATE keywords CASCADE;
ALTER TABLE keywords
ADD COLUMN uuid UUID DEFAULT gen_random_uuid(),
DROP CONSTRAINT keywords_pkey CASCADE,
ADD PRIMARY KEY (uuid),
DROP COLUMN id;
ALTER TABLE keywords RENAME COLUMN uuid TO id;

TRUNCATE articles CASCADE;
ALTER TABLE articles
ADD COLUMN uuid UUID DEFAULT gen_random_uuid(),
DROP CONSTRAINT articles_pkey CASCADE,
ADD PRIMARY KEY (uuid),
DROP COLUMN id;
ALTER TABLE articles RENAME COLUMN uuid TO id;

ALTER TABLE articles
DROP COLUMN parent CASCADE,
ADD COLUMN parent UUID,
ADD CONSTRAINT articles_articles_parent_fkey
FOREIGN KEY (parent)
REFERENCES articles (id);
---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
ALTER TABLE keywords
ADD COLUMN int_id SERIAL NOT NULL,
DROP CONSTRAINT keywords_pkey CASCADE,
ADD PRIMARY KEY (int_id),
DROP COLUMN id;
ALTER TABLE keywords RENAME COLUMN int_id TO id;

ALTER TABLE articles
ADD COLUMN int_id SERIAL NOT NULL,
DROP CONSTRAINT articles_pkey CASCADE,
ADD PRIMARY KEY (int_id),
DROP COLUMN id;
ALTER TABLE articles RENAME COLUMN int_id TO id;

ALTER TABLE articles
DROP COLUMN parent CASCADE,
ADD COLUMN parent UUID,
ADD CONSTRAINT articles_articles_parent_fkey
FOREIGN KEY (parent)
REFERENCES articles (id);