-- Write your migrate up statements here
ALTER TABLE public.users
ADD COLUMN is_admin BOOLEAN DEFAULT false,
ADD COLUMN is_activated BOOLEAN DEFAULT true,
DROP COLUMN first_name,
DROP COLUMN last_name;

---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
ALTER TABLE public.users
DROP COLUMN is_admin,
DROP COLUMN is_activated,
ADD COLUMN first_name,
ADD COLUMN last_name;