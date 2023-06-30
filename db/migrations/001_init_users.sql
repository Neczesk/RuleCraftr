-- Write your migrate up statements here
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY NOT NULL,
    username TEXT UNIQUE NOT NULL,
    passhash TEXT NOT NULL,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    created_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() at time zone 'utc')
);

CREATE TABLE public.rulesets (
    id SERIAL PRIMARY KEY NOT NULL,
    rn_name TEXT NOT NULL,
    public BOOLEAN NOT NULL DEFAULT false,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() at time zone 'utc')
);

CREATE TABLE public.articles (
    id SERIAL PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    content JSON,
    ruleset INTEGER NOT NULL REFERENCES rulesets(id),
    parent INTEGER REFERENCES articles(id),
    sort INTEGER NOT NULL DEFAULT 0,
    created_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() at time zone 'utc')
);

CREATE TABLE public.keywords (
    id SERIAL PRIMARY KEY NOT NULL,
    keyword TEXT NOT NULL,
    long_definition TEXT,
    short_definition TEXT,
    ruleset INTEGER NOT NULL REFERENCES rulesets(id),
    created_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() at time zone 'utc')
);
---- create above / drop below ----


DROP TABLE public.keywords;
DROP TABLE public.articles;
DROP TABLE public.rulesets;
DROP TABLE public.users;
-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
