const pool = require('../utils/pool');

module.exports = class User{

    userId;
    name;
    email;
    phoneNumber;
    carrier;
    passwordHash;

    constructor(rows){
      this.userId = rows.user_id;
      this.name = rows.name;
      this.email = rows.email;
      this.phoneNumber = rows.phone_number;
      this.carrier = rows.carrier;
      this.passwordHash = rows.password_hash;
    }

    static async insert(name, email, phoneNumber, carrier, passwordHash) {
      const { rows } = await pool.query(`
      INSERT INTO users (name, email, phone_number, carrier, password_hash)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING users.user_id, users.name, users.email, users.phone_number, users.carrier`, 
      [name, email, phoneNumber, carrier, passwordHash]);
      
      return new User(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE id=$1',
        [id]
      );

      if(!rows[0]) throw new Error(`No user with id ${id} found`);

      return new User(rows[0]);
    }

    static async findByEmail(email) {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE email=$1',
        [email]
      );
      if(!rows[0]) throw new Error(`No user with email ${email} found.`);
      return new User(rows[0]);
    }

    toJSON() {
      const json = { ...this };
      delete json.passwordHash;
      return json;
    }
};
