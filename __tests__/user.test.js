const userModel = require('../models/userModel');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Tests for User Model', () => {
    afterEach(async () => {
        await prisma.user.deleteMany();
      });
    
      afterAll(async () => {
        await prisma.$disconnect();
      });

  // Test for findOne
  test('findOne returns a user if they exist', async () => {
    const user1 = {
      name: "Jimmy Doe",
      email: "jimmy123@gmail.com",
      password: "jimmy123!",
      role: "regular",
    };
    const createdUser = await userModel.addUser(user1);
    const foundUser = await userModel.findOne(createdUser.email);
    expect(foundUser.email).toEqual(createdUser.email);
  });

  // Test for findOne when user does not exist
test('findOne returns null if user does not exist', async () => {
  const email = "abc@gmail.com";
  const user = await userModel.findOne(email);
  expect(user).toBeNull();
});

  // Test for findById
  test('findById returns a user if they exist', async () => {
    const user2 = {
      name: "Johnny Doe",
      email: "johnny123@gmail.com",
      password: "johnny123!",
      role: "admin",
    };
    const createdUser = await userModel.addUser(user2);
    const foundUser = await userModel.findById(createdUser.id);
    expect(foundUser.id).toEqual(createdUser.id);
  });

  // Test for findById when user does not exist
test('findById throws error if user does not exist', async () => {
  const id = '663ae7a7f34f763ca8e58d6f'; 
  await expect(userModel.findById(id)).rejects.toThrow(`Couldn't find user with id: ${id}`);
});

  // Test for addUser
  test('addUser creates a new user', async () => {
    const user3 = {
      name: "Michael Reefs",
      email: "michaelreefs@gmail.com",
      password: "michael123!",
      role: "regular",
    };
    const newUser = await userModel.addUser(user3);
    expect(newUser.email).toEqual(user3.email);
  });

  // Test for addUser when user data is invalid
test('addUser throws error if user data is invalid', async () => {
  const user = {
    name: 12,
    email: "invalid", 
    password: "123", 
    role: "regular",
  };
  await expect(userModel.addUser(user)).rejects.toThrow();
});
});