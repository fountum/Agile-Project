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
      res.render("note/index", { notes: notes })
    } else {
      res.redirect("/login")
    }
  },

  new: (req, res) => {
    res.render("note/create")
  },

  listOne: async (req, res) => {
    let noteToFind = req.params.id
    let searchResult = await prisma.note.findUnique({
      where: {
        id: noteToFind,
      },
    })
    if (searchResult != null) {
      res.render("note/single-note", { noteItem: searchResult })
    } else {
      let notes = await prisma.note.findMany({
        where: {
          userId: req.user.id,
        },
      })
      res.render("note/index", { notes: notes })
    }
  },

  create: async (req, res) => {
    let noteData = {
      title: req.body.title,
      content: JSON.parse(req.body.content),
      userId: req.user.id,
      dateCreated: new Date()
    }
    let newNote = await prisma.note.create({
      data: noteData
    })
    res.render("note")
  },

  edit: async (req, res) => {
    let noteToFind = req.params.id
    let searchResult = await prisma.note.findUnique({
      where: {
        id: noteToFind,
      },
    })
    res.render("note/edit", { noteItem: searchResult })
  },

  update: async (req, res) => {
    try {
      let noteToFind = req.params.id
      let note = await prisma.note.findUnique({
        where: {
          id: noteToFind,
        },
      })
      if (!note) {
        return res.status(404).send("Note not found")
      }
      let updatedNote = await prisma.note.update({
        where: {
          id: noteToFind,
        },
        data: {
          title: req.body.title,
          content: req.body.content,
        },
      })
      res.redirect("/notes")
    } catch (error) {
      console.error("Error updating note:", error)
      res.status(500).send("Server Error")
    }
  },

  delete: async (req, res) => {
    let noteToFind = req.params.id
    await prisma.note.delete({
      where: {
        id: noteToFind,
      },
    })
    res.redirect("/notes")
  },



  admin: (req, res) => {
  
    req.sessionStore.all((err, sessions) => {
      if (err) {
        console.log(err)
        return res.redirect("/login")
      }
  
      console.log(sessions)
  
      let sessionList = []
      for (let key in sessions) {
        if (req.user.id != sessions[key].passport.user) {
          console.log(key)
          sessionList.push({"SessionID":key, "UserID":sessions[key].passport.user})
        }
      }
      res.render("admin", { user: req.user, sessions: sessionList })
    })
  
  },
  destroy: (req, res) => {
    const sessionId = req.params.sessionId
    req.sessionStore.destroy(sessionId, (err) => {
      if (err) {
        console.log(err)
        res.redirect("/admin")
      } else {
        res.redirect('/admin')
      }
    })
  },

  logout: (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          console.log(err)
        }
        res.redirect('/login') 
      })
    }

}

module.exports = notesController