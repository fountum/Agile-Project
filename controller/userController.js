const userModel = require("../models/userModel").userModel
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function isUserValid(user, password) {
  return user.password === password
}

const getUserByEmailIdAndPassword = async (email, password) => {
  let user = await userModel.findOne(email)
  if (user) {
    if (isUserValid(user, password)) {
      // console.log(prisma)
      return user
    }
  }
  console.log("User cannot be found: getuserByEmailIDandPassword")
  return null
}

const getUserById = async (id) => {
  let user = await userModel.findById(id)
  if (user) {
    return user
  }
  console.log("User cannot be found: getUserById")
  return null
}

module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
}