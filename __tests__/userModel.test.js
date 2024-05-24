const userModel = require('../models/userModel');
const userController = require('../controller/userController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// USER MODEL
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


// USER CONTROLLER
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
