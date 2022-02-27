DROP TABLE IF EXISTS listings_filters;

CREATE TABLE listings_filters(
	listing_id BIGINT NOT NULL,
	filter_id BIGINT NOT NULL
);

DROP FUNCTION IF EXISTS loop_over_rows();

CREATE OR REPLACE FUNCTION loop_over_rows() RETURNS VOID AS $$
DECLARE listing_rec RECORD;
DECLARE filter_rec RECORD;
BEGIN
	FOR filter_rec IN (SELECT * FROM filters) LOOP
		FOR listing_rec IN (select * from listings where scrape_timestamp = (select MAX(scrape_timestamp) from listings)) LOOP
				IF(
					listing_rec.square_feet >= filter_rec.square_feet_min AND 
					listing_rec.square_feet <= filter_rec.square_feet_max AND
					listing_rec.price >= filter_rec.price_min AND 
					listing_rec.price <= filter_rec.price_max AND
					listing_rec.bed >= filter_rec.bed_min AND 
					listing_rec.bed <= filter_rec.bed_max AND
					listing_rec.bath >= filter_rec.bath_min AND 
					listing_rec.bath <= filter_rec.bath_max	
				) THEN
					INSERT INTO listings_filters VALUES (listing_rec.id, filter_rec.filter_id);
				END IF;
		END LOOP;
	END LOOP;
END;
$$ LANGUAGE PLPGSQL;

select loop_over_rows();
