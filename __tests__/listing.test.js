const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Listing = require('../lib/models/Listing.js');

const agent1 = request.agent(app);
const agent2 = request.agent(app);

describe('realo-app-backend routes', () => {
  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/user.sql', 'utf-8'));
    await pool.query(fs.readFileSync('./sql/filter.sql', 'utf-8'));
    await pool.query(fs.readFileSync('./sql/scrape.sql', 'utf-8'));

    await UserService.create({
      email: 'test@test.com',
      password: 'password',
      name: 'Jon Arbuckle',
      phoneNumber: '1235671234',
      carrier: 'att'
    });

    await agent1
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        name: 'Jon Arbuckle',
        phoneNumber: '1235671234',
        carrier: 'att'
      });

    await agent1
      .post('/api/v1/filter')
      .send({
        filterName: 'My first filter!',
        squareFeetMin: 0,
        squareFeetMax: 10000000,
        bedMin: 0,
        bedMax: 20,
        bathMin: 0,
        bathMax: 20,
        priceMin: 0,
        priceMax: 1000000000
      });

    await UserService.create({
      email: 'test1@test.com',
      password: 'password',
      name: 'Joan Arbuckle',
      phoneNumber: '9876543210',
      carrier: 'verizon'
    });
  
    await agent2
      .post('/api/v1/auth/login')
      .send({
        email: 'test1@test.com',
        password: 'password',
        name: 'Joan Arbuckle',
        phoneNumber: '9876543210',
        carrier: 'verizon'
      });
  
    await agent2
      .post('/api/v1/filter')
      .send({
        filterName: 'My second filter!',
        squareFeetMin: 0,
        squareFeetMax: 10000000,
        bedMin: 0,
        bedMax: 20,
        bathMin: 0,
        bathMax: 20,
        priceMin: 0,
        priceMax: 1000000000
      });

  });

  afterAll(() => {
    pool.end();
  });

  it.skip('latest listings with corresponding matching filters and owners directly from model', async() => {
    const newListing = {
      id: '123456789', 
      source: 'Zillow', 
      address: 'test lane Portland OR 97210', 
      link: 'https://www.zillow.com/homedetails/6430-N-Montana-Ave-Portland-OR-97217/53938559_zpid/', 
      price: '10', 
      squareFeet: '1', 
      bed: '1', 
      bath: '1', 
      scrapeTimestamp: new Date()
    };

    await Listing.insert(newListing);

    const res = await Listing.getTextingList();

    await Listing.remove('123456789');

    expect(res).toEqual([
      {
        phoneNumber: '1235671234',
        carrier: 'att',
        link: 'https://www.zillow.com/homedetails/6430-N-Montana-Ave-Portland-OR-97217/53938559_zpid/'
      },
      {
        phoneNumber: '9876543210',
        carrier: 'verizon',
        link: 'https://www.zillow.com/homedetails/6430-N-Montana-Ave-Portland-OR-97217/53938559_zpid/'
      }
    ]);
  });

  it.skip('get latest timestamp from database', async() => {
    const newListing = {
      id: '123456789', 
      source: 'Zillow', 
      address: 'test lane Portland OR 97210', 
      link: 'https://www.zillow.com/homedetails/6430-N-Montana-Ave-Portland-OR-97217/53938559_zpid/', 
      price: '10', 
      squareFeet: '1', 
      bed: '1', 
      bath: '1', 
      scrapeTimestamp: new Date()
    };

    await Listing.insert(newListing);

    const res = await Listing.latestTime();

    await Listing.remove('123456789');

    expect(res).toEqual(newListing.scrapeTimestamp);
  });
});
