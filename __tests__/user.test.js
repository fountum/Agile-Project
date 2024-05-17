const mongoose = require('mongoose');
const { userModel } = require('../models/userModel.js');
// const { remindersController } = require('../controller/reminder_controller.js');
const  remindersController  = require('../controller/reminder_controller.js');

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

// Test suite for User model
describe('User model test', () => {
  // Test case for creating a new user
  it('should create a new user', async () => {
    const user = await userModel.addUser({ name: 'A new user', email: 'test@example.com', password: 'password', role: 'regular' });
    const foundUser = await userModel.findById(user.id);
    expect(foundUser.name).toBe('Test User');
  });

  // Test case for finding a user by their id
  it("should find a user by their id", async () => {
    const user = await userModel.findById('1');
    expect(user.name).toBe('Test User');
  })

  // Test case for handling a user not found scenario
  it('should return null if the user is not found', async () => {
    const user = await userModel.findById('30');
    expect(user).toBeNull();
  })
});

// Mock the reminder controller
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

// Test suite for Reminder controller
describe('Reminder controller test', () => {
  // Test case for creating a new reminder
  it('should create a new reminder', async () => {
    const reminder = await remindersController.create({ userId: '1', title: 'Test Reminder', description: 'This is a test reminder', date: new Date() });
    const foundReminder = await remindersController.findById(reminder.id);
    expect(foundReminder.title).toBe('Test Reminder');
  });

  // Test case for finding a reminder by its id
  it("should find the reminder by its given id", () =>{
    const reminder = remindersController.findById("1")
    expect(reminder.title).toBe("Test Reminder ")
  })

  // Test case for handling a reminder not found scenario
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

it('should update a reminder for the user', async () => {
  // Update the reminder for the user
  const updatedReminder = await remindersController.update({ id: createdReminder.id, title: 'Updated Test Reminder', description: 'This is an updated test reminder', date: new Date() });
  // Check that the reminder was updated correctly
  expect(updatedReminder.title).toBe('Updated Test Reminder');
  expect(updatedReminder.userId).toBe(createdUser.id);
});

it('should delete a reminder for the user', async () => {
  // Delete the reminder for the user
  const deletedReminder = await remindersController.delete(createdReminder.id);
  // Check that the reminder was deleted correctly
  expect(deletedReminder).toBeNull();
});

it('should retrieve all reminders for the user', async () => {
  // Create another reminder for the user
  createdReminder2 = await remindersController.create({ userId: createdUser.id, title: 'Test Reminder 2', description: 'This is another test reminder', date: new Date() });
  // Retrieve all reminders for the user
  const reminders = await remindersController.list({ userId: createdUser.id });
  // Check that all reminders were retrieved correctly
  expect(reminders).toContainEqual(createdReminder);
  expect(reminders).toContainEqual(createdReminder2);
});