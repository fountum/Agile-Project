const userController = require("../controller/userController")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

let notesController = {
  list: async (req, res) => {
    let notes = await prisma.note.findMany({
      where: {
        userId: req.user.id,
      },
    })
    if (req.user && req.user.role === "admin") {
        res.redirect('/admin')
    } else if (req.user && req.user.role === "regular") {
      res.render("notes/notes", { notes: notes })
    } else {
      res.redirect("/login")
    }
  },


}

module.exports = notesController