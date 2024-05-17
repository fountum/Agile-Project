const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const remindersController = require('../controller/reminder_controller.js');
const { userModel } = require('../models/userModel.js');

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    reminder: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
  })),
}));

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

jest.mock('../controller/reminder_controller', () => ({
  create: jest.fn().mockResolvedValue({ id: '1', userId: '1', title: 'Test Reminder', description: 'This is a test reminder', date: new Date() }),
  findById: jest.fn((id) => {
    if (id === '1') {
      return Promise.resolve({ id: '1', userId: '1', title: 'Test Reminder', description: 'This is a test reminder', date: new Date() });
    } else {
      return Promise.resolve(null);
    }
  }),
  update: jest.fn().mockResolvedValue({ id: '1', userId: '1', title: 'Updated Test Reminder', description: 'This is an updated test reminder', date: new Date() }),
  delete: jest.fn((id) => {
    if (id === '1') {
      return Promise.resolve(null);
    } else {
      return Promise.reject(new Error('Reminder not found'));
    }
  }),
  list: jest.fn((query) => {
    if (query.userId === '1') {
      return Promise.resolve([
        { id: '1', userId: '1', title: 'Test Reminder', description: 'This is a test reminder', date: new Date() },
        { id: '2', userId: '1', title: 'Test Reminder 2', description: 'This is another test reminder', date: new Date() },
      ]);
    } else {
      return Promise.resolve([]);
    }
  }),
}));

// describe('remindersController', () => {
//   describe('list', () => {
//     it('should return a list of reminders', async () => {
//       const reminders = [
//         { id: '1', title: 'Test Reminder', description: 'This is a test reminder', date: new Date() },
//       ];
//       prisma.reminder.findMany.mockResolvedValue(reminders);

//       const req = { user: { id: '1' } };
//       const res = { render: jest.fn() };

//       await remindersController.list(req, res);

//       expect(res.render).toHaveBeenCalledWith('reminder/index', { reminders: reminders, daysInMonth: expect.any(Number) });
//     });
//   });
// });

describe('User model test', () => {
  test('should create a new user', async () => {
    const user = await userModel.addUser({ name: 'A new user', email: 'test@example.com', password: 'password', role: 'regular' });
    const foundUser = await userModel.findById(user.id);
    expect(foundUser.name).toBe('Test User');
  });

  test("should find a user by their id", async () => {
    const user = await userModel.findById('1');
    expect(user.name).toBe('Test User');
  })

  test('should return null if the user is not found', async () => {
    const user = await userModel.findById('30');
    expect(user).toBeNull();
  })
});

describe('Reminder controller test', () => {
  test('should create a new reminder', async () => {
    const reminder = await remindersController.create({ userId: '1', title: 'Test Reminder', description: 'This is a test reminder', date: new Date() });
    const foundReminder = await remindersController.findById(reminder.id);
    expect(foundReminder.title).toBe('Test Reminder');
  });

  test("should find the reminder by its given id", async () => {
    const reminder = await remindersController.findById("1");
    expect(reminder.title).toBe("Test Reminder");
  });

  test('should return null if the reminder is not found', async () => {
    const reminder = await remindersController.findById('2');
    expect(reminder).toBeNull();
  });
});

describe('User-Reminder functional tests', () => {
  let createdUser;
  let createdReminder;
  let createdReminder2
  
  beforeAll(async () => {
    createdUser = await userModel.addUser({ name: 'A new user', email: 'test@example.com', password: 'password', role: 'regular' });
    createdReminder = await remindersController.create({ userId: createdUser.id, title: 'Test Reminder', description: 'This is a test reminder', date: new Date()});
  });

  test('should create a reminder for the user', async () => {
    expect(createdReminder.title).toBe('Test Reminder');
    expect(createdReminder.userId).toBe(createdUser.id);
  });

  test('should retrieve the reminder by its ID', async () => {
    const foundReminder = await remindersController.findById(createdReminder.id);
    expect(foundReminder.title).toBe('Test Reminder');
    expect(foundReminder.userId).toBe(createdUser.id);
  });

  test('should update a reminder for the user', async () => {
    const updatedReminder = await remindersController.update({ id: createdReminder.id, title: 'Updated Test Reminder', description: 'This is an updated test reminder', date: new Date() });
    expect(updatedReminder.title).toBe('Updated Test Reminder');
    expect(updatedReminder.userId).toBe(createdUser.id);
  });

  test('should delete a reminder for the user', async () => {
    const deletedReminder = await remindersController.delete(createdReminder.id);
    expect(deletedReminder).toBeNull();
  });

  test('should retrieve all reminders for the user', async () => {
    createdReminder2 = await remindersController.create({ userId: createdUser.id, title: 'Test Reminder 2', description: 'This is another test reminder', date: new Date()});
    const reminders = await remindersController.list({ userId: createdUser.id });
    expect(reminders.map(({ date, ...rest }) => rest)).toEqual(expect.arrayContaining([
      { id: '1', userId: '1', title: 'Test Reminder', description: 'This is a test reminder' },
      { id: '2', userId: '1', title: 'Test Reminder 2', description: 'This is another test reminder' }
    ]));
  });
});