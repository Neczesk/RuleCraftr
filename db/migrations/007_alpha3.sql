-- Write your migrate up statements here
UPDATE keywords SET long_definition = '[{type: ''paragraph'',children: [{ text: '''' }],},]';
ALTER TABLE keywords
ADD COLUMN tag TEXT,
ADD COLUMN last_modified TIMESTAMPTZ NOT NULL DEFAULT (NOW() at time zone 'utc');
