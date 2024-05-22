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


  notebook: async (req, res) => {
    let notes = await prisma.note.findMany({
      where: {
        userId: req.user.id,
      },
    })
    // Assuming you want to redirect with the ID of the first note
    let noteId = notes.length > 0 ? notes[0].id : null;
    res.redirect(`http://localhost:5173/?userId=${req.user.id}&noteId=${noteId}`)
  },

  save: async (reqq, res) => {
    const {content, userID} = req.body;
    const newNote = await prisma.note.create({
      data: {
        content: content,
        userId: userID
      }
    })
  }


}

module.exports = notesController