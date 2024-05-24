const userModel = require("../models/userModel").userModel
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function isUserValid(user, password) {
  return user.password === password
}

const getUserByEmailAndPassword = async (email, password) => {
  let user = await prisma.user.findUnique({ where: { email: email, }, }); 
  if (user) {
    if (isUserValid(user, password)) {
      return user;
    }
  }
  console.log("User cannot be found");
  return null;
};

const getUserById = async (id) => {
  let user = await prisma.user.findUnique({ where: { id: id, }, });
  if (user) {
    return user;
  }
  console.log("User cannot be found: getUserById");
  return null;
};

module.exports = {
  getUserByEmailAndPassword,
  getUserById,
}