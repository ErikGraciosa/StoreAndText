DROP TABLE IF EXISTS filters CASCADE;

CREATE TABLE filters(
  filter_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT REFERENCES users(user_id),
  filter_name TEXT NOT NULL,
  square_feet_min INTEGER NOT NULL,
  square_feet_max INTEGER NOT NULL,
  bed_min INTEGER NOT NULL,
  bed_max INTEGER NOT NULL,
  bath_min INTEGER NOT NULL,
  bath_max INTEGER NOT NULL,
  price_min INTEGER NOT NULL,
  price_max INTEGER NOT NULL
);
