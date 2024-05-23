const mongoose = require('mongoose');
const { userModel } = require('../models/userModel.js');
// const { remindersController } = require('../controller/reminder_controller.js');
const remindersController = require('../controller/reminder_controller');
// Mock the addUser function
jest.mock('../models/userModel.js', () => ({
  userModel: {
    addUser: jest.fn().mockResolvedValue({ id: '1', name: 'Test User', email: 'test@example.com', password: 'password', role: 'regular' }),
    findById: jest.fn((id)=>{
      if(id === '1'){
        return Promise.resolve({ id: '1', name: 'Test User', email: 'test@example.com', password: 'password', role: 'regular' });
      } else {
        return Promise.resolve(null);

      }
    }),
  },
}));



describe('User model test', () => {

  it('should create a new user', async () => {
    const user = await userModel.addUser({ name: 'A new user', email: 'test@example.com', password: 'password', role: 'regular' });
  
    const foundUser = await userModel.findById(user.id);
    expect(foundUser.name).toBe('Test User');
  });



  
  it('should return null if the user is not found', async () => {
    const user = await userModel.findById('30');
    expect(user).toBeNull();
  })

});


jest.mock('../controller/reminder_controller', () => ({
  create: jest.fn().mockResolvedValue({ id: '1', userId: '1', title: 'Test Reminder', description: 'This is a test reminder', date: new Date() }),
  findById: jest.fn((id) => {
    if (id === '1') {
      return Promise.resolve({ id: '1', userId: '1', title: 'Test Reminder', description: 'This is a test reminder', date: new Date() });
    } else {
      return Promise.resolve(null);
    }
  }),
}));

describe('Reminder controller test', () => {

  it('should create a new reminder', async () => {
    const reminder = await remindersController.create({ userId: '1', title: 'Test Reminder', description: 'This is a test reminder', date: new Date() });
  
    const foundReminder = await remindersController.findById(reminder.id);
    expect(foundReminder.title).toBe('Test Reminder');
  });

  it("should find the reminder by its given id", () =>{
    const reminder = remindersController.findById("1")
    expect(reminder.title).toBe("Test Reminder ")
  })

  it('should return null if the reminder is not found', async () => {
    const reminder = await remindersController.findById('2');
    expect(reminder).toBeNull();
  });
});



// Functional tests for the interaction between userModel and remindersController
describe('User-Reminder functional tests', () => {
  let createdUser;
  let createdReminder;

  beforeAll(async () => {
    // Create a user
    createdUser = await userModel.addUser({ name: 'A new user', email: 'test@example.com', password: 'password', role: 'regular' });
  });

  it('should create a reminder for the user', async () => {
    // Create a reminder for the user
    createdReminder = await remindersController.create({ userId: createdUser.id, title: 'Test Reminder', description: 'This is a test reminder', date: new Date() });
    // Check that the reminder was created correctly
    expect(createdReminder.title).toBe('Test Reminder');
    expect(createdReminder.userId).toBe(createdUser.id);
  });

  it('should retrieve the reminder by its ID', async () => {
    // Retrieve the reminder by its ID
    const foundReminder = await remindersController.findById(createdReminder.id);
    // Check that the reminder was retrieved correctly
    expect(foundReminder.title).toBe('Test Reminder');
    expect(foundReminder.userId).toBe(createdUser.id);
  });
});

