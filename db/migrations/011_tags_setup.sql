-- Write your migrate up statements here
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag TEXT NOT NULL UNIQUE,
    is_core BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags_rulesets (
    tag_id UUID NOT NULL REFERENCES tags(id),
    ruleset_id INTEGER NOT NULL REFERENCES rulesets(id)
);

CREATE INDEX tags_tag_index ON tags(tag text_pattern_ops);
---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
DROP TABLE tags_rulesets;
DROP TABLE tags;