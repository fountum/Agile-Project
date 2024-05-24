const reminderModel = require('../models/reminderModel');
const userModel = require('../models/userModel');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Tests for Reminder Model', () => {
  let userID;
  let reminderID;
  beforeEach(async () => {
    const user1 = await userModel.addUser({ name: "Andrew Taylor", email: "andrew123@gmail.com",password: "andrew123!", role: "regular"});
    const reminder1 = await reminderModel.create({ title: "Grocery shopping", description: "Buy milk and bread from safeway", completed: false, dateCreated: new Date(), userId: user1.id });
    user1ID = user1.id;
    reminder1ID = reminder1.id;
  });

  afterEach(async () => {
    await prisma.reminder.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should list all reminders for a user', async () => {
    const reminders = await reminderModel.list(user1ID);
    expect(reminders).toEqual(expect.any(Array));
  });

  it('should find a reminder by id', async () => {
    const foundReminder = await reminderModel.find(reminder1ID);
    expect(foundReminder.id).toEqual(reminder1ID);
  });

  it('should create a new reminder', async () => {
    const reminder2 = await reminderModel.create({ title: "Car maintenance", description: "Change oil and check tire pressure", completed: false, dateCreated: new Date(), userId: user1ID }); 
    expect(reminder2).toHaveProperty('id');

  });

  it('should update a reminder', async () => {
    const updatedReminder = await reminderModel.update(reminder1ID, { title: 'Updated', description: 'Updated' });
    expect(updatedReminder.title).toEqual('Updated');
  });

  it('should delete a reminder', async () => {
    await reminderModel.delete(reminder1ID);
    const foundReminder = await reminderModel.find(reminder1ID);
    expect(foundReminder).toBeNull();
  });
 });