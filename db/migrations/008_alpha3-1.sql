-- Write your migrate up statements here
ALTER TABLE keywords
DROP COLUMN long_definition,
ADD COLUMN long_definition JSON DEFAULT '[{"type":"paragraph","children":[{"text":"Start typing here..."}]}]';
