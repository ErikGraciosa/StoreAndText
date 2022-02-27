const pool = require('../utils/pool');
const fs = require('fs');

module.exports = class Listing {
  id;
  source;
  address;
  link;
  price;
  squareFeet;
  bed;
  bath;
  scrapeTimestamp;

  constructor(row) {
    this.id = row.id;
    this.source = row.source;
    this.address = row.address;
    this.link = row.link;
    this.price = row.price;
    this.squareFeet = row.square_feet;
    this.bed = row.bed;
    this.bath = row.bath;
    this.scrapeTimestamp = row.scrape_timestamp;
  }

  static async insert({ id, source, address, link, price, squareFeet, bed, bath, scrapeTimestamp }) {
    const { rows } = await pool.query(
      `INSERT into listings (id, source, address, link, price, square_feet, bed, bath, scrape_timestamp) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO NOTHING
       RETURNING *`,
      [id, source, address, link, price, squareFeet, bed, bath, scrapeTimestamp]
    );

    if(!rows[0]){
      return null;
    }
    return new Listing(rows[0]);
  }

  static async remove(id) {
    const { rows } = await pool.query(
      `DELETE FROM listings where id = $1
       RETURNING *`,
      [id]
    );

    if(!rows[0]){
      return null;
    }
    return new Listing(rows[0]);
  }

  static async getTextingList() {
    
    await pool.query(fs.readFileSync('./sql/listingsFilter.sql', 'utf-8'));

    const { rows } = await pool.query(
      `SELECT DISTINCT
        users.phone_number,
        users.carrier,
        listings.link
      FROM 
        listings_filters 
      LEFT JOIN 
        filters 
      ON 
        filters.filter_id = listings_filters.filter_id 
      LEFT JOIN 
        listings 
      ON 
        listings.id = listings_filters.listing_id
      LEFT JOIN 
        users
      ON 
        filters.user_id = users.user_id
      ORDER BY phone_number`
    );

    if(!rows[0]){
      return null;
    }

    return rows.map(row => {return { 
      phoneNumber: row.phone_number,
      carrier: row.carrier,
      link: row.link
    };
    });
  }

  static async latestTime() {
    const { rows } = await pool.query(
      'SELECT MAX(scrape_timestamp) FROM listings'
    );

    if(!rows[0]){
      return null;
    }
    return rows[0].max;
  }


};
