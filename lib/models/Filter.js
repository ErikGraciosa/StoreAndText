const pool = require('../utils/pool');

module.exports = class Filter {
  filterId;
  userId;
  filterName;
  squareFeetMin;
  squareFeetMax;
  bedMin;
  bedMax;
  bathMin;
  bathMax;
  priceMin;
  priceMax;

  constructor(row) {
    this.filterId = String(row.filter_id);
    this.userId = String(row.user_id);
    this.filterName = row.filter_name;
    this.squareFeetMin = String(row.square_feet_min);
    this.squareFeetMax = String(row.square_feet_max);
    this.bedMin = String(row.bed_min);
    this.bedMax = String(row.bed_max);
    this.bathMin = String(row.bath_min);
    this.bathMax = String(row.bath_max);
    this.priceMin = String(row.price_min);
    this.priceMax = String(row.price_max);
  }

  static async insert({ filterName, squareFeetMin, squareFeetMax, bedMin, bedMax, bathMin, bathMax, priceMin, priceMax }, userId) {

    const { rows } = await pool.query(
      `INSERT into filters (filter_name, square_feet_min, square_feet_max, bed_min, bed_max, bath_min, bath_max, price_min, price_max, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [filterName, squareFeetMin, squareFeetMax, bedMin, bedMax, bathMin, bathMax, priceMin, priceMax, userId]
    );

    return new Filter(rows[0]);
  }

  static async remove(filterId, userId) {
    const { rows } = await pool.query(
      `DELETE FROM filters WHERE filter_id = $1 and user_id = $2
       RETURNING *`,
      [filterId, userId]
    );

    if(!rows[0]) throw new Error(`No filter with id ${filterId} is valid for user ${userId} to delete`);

    return new Filter(rows[0]);
  }

  static async getFiltersByUserId(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM filters WHERE user_id = $1 ORDER BY filter_id',
      [userId]
    );

    if(!rows[0]) return [];

    return rows.map(row => {
      const result = { ...row };
      delete result.count;
      return new Filter(result);
    });
  }
};
