const userModel = require('../models/userModel');
const userController = require('../controller/userController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Tests for User Controller', () => {
    afterEach(async () => {
      await prisma.user.deleteMany();
    });
  
    afterAll(async () => {
      await prisma.$disconnect();
    });
  
    // // Test for getUserByEmailIdAndPassword
    // test('getUserByEmailAndPassword returns a user if they exist', async () => {
    //   const user1 = {
    //     name: "Jimmy Doe",
    //     email: "jimmy123@gmail.com",
    //     password: "password",
    //     role: "regular",
    //   };
    //   await prisma.user.create({ data: user1 });
  
    //   const user = await userController.getUserByEmailAndPassword(user1.email, user1.password);
    //   expect(user.email).toEqual(user1.email);
    //   expect(user.password).toEqual(user1.password);
    // });
  
    // Test for getUserByEmailAndPassword when user does not exist
  test('getUserByEmailAndPassword returns null if user does not exist', async () => {
    const user = await userController.getUserByEmailAndPassword('nonexistent@gmail.com', 'password');
    expect(user).toBeNull();
  });
  // Test for getUserByEmailAndPassword when password is incorrect
  test('getUserByEmailAndPassword returns null if password is incorrect', async () => {
    const user1 = {
      name: "Jimmy Doe",
      email: "jimmy123@gmail.com",
      password: "password",
      role: "regular",
    };
    await prisma.user.create({ data: user1 });
  
    const user = await userController.getUserByEmailAndPassword(user1.email, 'wrongpassword');
    expect(user).toBeNull();
  });
  
    // Test for getUserById
    test('getUserById returns a user if they exist', async () => {
      const user1 = {
        name: "Jimmy Doe",
        email: "jimmy123@gmail.com",
        password: "password",
        role: "regular",
      };
      const createdUser = await prisma.user.create({ data: user1 });
  
      const user = await userController.getUserById(createdUser.id);
      expect(user.email).toEqual(user1.email);
      expect(user.password).toEqual(user1.password);
    });
  
    // Test for getUserById when user does not exist
  test('getUserById returns null if user does not exist', async () => {
    const user = await userController.getUserById('663ae7a7f34f763ca8e58d6f');
    expect(user).toBeNull();
  });
  
  
  
  });
  