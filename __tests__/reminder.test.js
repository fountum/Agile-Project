const reminderModel = require('../models/reminderModel');
const userModel = require('../models/userModel');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Reminder Model', () => {
  let userId;

  beforeEach(async () => {
    const user = await userModel.addUser({ name: "Jimmy Doe", email: "jimmy123@gmail.com",password: "jimmy123!", role: "regular"});
  });

  afterEach(async () => {
    await prisma.reminder.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should list all reminders for a user', async () => {
    const reminders = await reminderModel.list(user.id);
    expect(reminders).toEqual(expect.any(Array));
  });

  it('should find a reminder by id', async () => {
    const reminder = await reminderModel.create({ title: 'Test', description: 'Test', userId: userId });
    const foundReminder = await reminderModel.find(reminder.id);
    expect(foundReminder.id).toEqual(reminder.id);
  });

  it('should create a new reminder', async () => {
    const reminder = await reminderModel.create({ title: 'Test', description: 'Test', userId: userId });
    expect(reminder).toHaveProperty('id');
  });

  it('should update a reminder', async () => {
    const reminder = await reminderModel.create({ title: 'Test', description: 'Test', userId: userId });
    const updatedReminder = await reminderModel.update(reminder.id, { title: 'Updated', description: 'Updated' });
    expect(updatedReminder.title).toEqual('Updated');
  });

  it('should delete a reminder', async () => {
    const reminder = await reminderModel.create({ title: 'Test', description: 'Test', userId: userId });
    await reminderModel.delete(reminder.id);
    const foundReminder = await reminderModel.find(reminder.id);
    expect(foundReminder).toBeNull();
  });
});