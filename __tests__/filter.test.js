const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const agent = request.agent(app);

describe('realo-app-backend routes', () => {
  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/user.sql', 'utf-8'));
    await pool.query(fs.readFileSync('./sql/filter.sql', 'utf-8'));

    await UserService.create({
      email: 'test@test.com',
      password: 'password',
      name: 'Jon Arbuckle',
      phoneNumber: '1235671234',
      carrier: 'att'
    });

    await agent
      .post('/api/v1/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password',
        name: 'Jon Arbuckle',
        phoneNumber: '1235671234',
        carrier: 'att'
      });
  });

  afterAll(() => {
    pool.end();
  });

  it('/POST add user filter', async() => {
    const res = await agent
      .post('/api/v1/filter')
      .send({
        filterName: 'My first filter!',
        squareFeetMin: 0,
        squareFeetMax: 10000,
        bedMin: 0,
        bedMax: 7,
        bathMin: 0,
        bathMax: 8,
        priceMin: 0,
        priceMax: 1000000
      });

    expect(res.statusCode).toEqual(302);
  });

  it('/DELETE remove user filter by id', async() => {
    const filter = await agent
      .post('/api/v1/filter')
      .send({
        filterName: 'My first filter!',
        squareFeetMin: 0,
        squareFeetMax: 10000,
        bedMin: 0,
        bedMax: 7,
        bathMin: 0,
        bathMax: 8,
        priceMin: 0,
        priceMax: 1000000
      });

    const res = await agent
      .delete(`/api/v1/filter/1`);

    expect(res.body).toEqual({
      userId: '1',
      filterId: '1',
      filterName: 'My first filter!',
      squareFeetMin: '0',
      squareFeetMax: '10000',
      bedMin: '0',
      bedMax: '7',
      bathMin: '0',
      bathMax: '8',
      priceMin: '0',
      priceMax: '1000000'
    });
  });

  it('/DELETE throw error if filter id does not exist', async() => {
    const res = await agent
      .delete('/api/v1/filter/1');

    expect(res.body).toEqual({
      message: 'No filter with id 1 is valid for user 1 to delete',
      status: 500
    });
  });

  it('/GET return all filters by user ID', async() => {
    const filter = await agent
      .post('/api/v1/filter')
      .send({
        filterName: 'My first filter!',
        squareFeetMin: 0,
        squareFeetMax: 10000,
        bedMin: 0,
        bedMax: 7,
        bathMin: 0,
        bathMax: 8,
        priceMin: 0,
        priceMax: 1000000
      });

    const filter2 = await agent
      .post('/api/v1/filter')
      .send({
        filterName: 'My second filter!',
        squareFeetMin: 0,
        squareFeetMax: 10000,
        bedMin: 0,
        bedMax: 7,
        bathMin: 0,
        bathMax: 8,
        priceMin: 0,
        priceMax: 1000000
      });

    const filter3 = await agent
      .post('/api/v1/filter')
      .send({
        filterName: 'My third filter!',
        squareFeetMin: 0,
        squareFeetMax: 10000,
        bedMin: 0,
        bedMax: 7,
        bathMin: 0,
        bathMax: 8,
        priceMin: 0,
        priceMax: 1000000
      });

    const res = await agent
      .get(`/api/v1/filter/1`);

    expect(res.body).toEqual([{
      userId: '1',
      filterId: '1',
      filterName: 'My first filter!',
      squareFeetMin: '0',
      squareFeetMax: '10000',
      bedMin: '0',
      bedMax: '7',
      bathMin: '0',
      bathMax: '8',
      priceMin: '0',
      priceMax: '1000000'
    }, 
    {
      userId: '1',
      filterId: '2',
      filterName: 'My second filter!',
      squareFeetMin: '0',
      squareFeetMax: '10000',
      bedMin: '0',
      bedMax: '7',
      bathMin: '0',
      bathMax: '8',
      priceMin: '0',
      priceMax: '1000000'
    }, 
    {
      userId: '1',
      filterId: '3',
      filterName: 'My third filter!',
      squareFeetMin: '0',
      squareFeetMax: '10000',
      bedMin: '0',
      bedMax: '7',
      bathMin: '0',
      bathMax: '8',
      priceMin: '0',
      priceMax: '1000000'
    }]);
  });

  it('/GET error message if no filters exist for user ID', async() => {
    const res = await agent
      .get('/api/v1/filter/1');

    expect(res.body).toEqual([]);
  });
});
