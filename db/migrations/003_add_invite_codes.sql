-- Write your migrate up statements here
CREATE TABLE public.invite_codes (
    id SERIAL PRIMARY KEY NOT NULL,
    key_value TEXT UNIQUE NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() at time zone 'utc'),
    used_date TIMESTAMPTZ,
    user_used INTEGER REFERENCES users(id)
);

---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
DROP TABLE public.invite_codes;