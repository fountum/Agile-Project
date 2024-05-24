const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const reminderModel = {
    list: async (userId) => {
      const reminders = await prisma.reminder.findMany({
        where: {
          userId: userId,
        },
      });
      return reminders;
    },
    find: async (id) => {
      const reminder = await prisma.reminder.findUnique({
        where: {
          id: id,
        },
      });
      return reminder;
    },
    create: async (reminder) => {
      const newReminder = await prisma.reminder.create({
        data: reminder,
      });
      return newReminder;
    },
    update: async (id, reminder) => {
      const updatedReminder = await prisma.reminder.update({
        where: {
          id: id,
        },
        data: reminder,
      });
      return updatedReminder;
    },
    delete: async (id) => {
      await prisma.reminder.delete({
        where: {
          id: id,
        },
      });
    },
  };
  
  module.exports = reminderModel;