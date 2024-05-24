// const request = require('supertest');
// const app = require('../index'); 

// describe('Test the root path', () => {
//     test('It should response the GET method', async () => {
//         const response = await request(app).get('/');
//         expect(response.statusCode).toBe(200);
//     });
// });

// describe('Test user registration', () => {
//     test('It should response the POST method', async () => {
//         const response = await request(app).post('/register').send({
//             name: 'Test User',
//             email: 'test@example.com',
//             password: 'password',
//         });
//         expect(response.statusCode).toBe(200);
//     });
// });

// // Add more tests for each route and method