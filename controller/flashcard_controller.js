const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

let flashcardsController = {
  list: async (req, res) => {
    let flashcards = await prisma.flashcard.findMany({
      where: {
        userId: req.user.id,
      },
    })
    if (req.user && req.user.role === "admin") {
      res.redirect('/admin')
    } else if (req.user && req.user.role === "regular") {
      res.render("flashcard/flashcards", { flashcards: flashcards })
    } else {
      res.redirect("/login")
    }
  },

  new: (req, res) => {
    res.render("flashcard/create")
  },

  listOne: async (req, res) => {
    let flashcardToFind = req.params.id
    let searchResult = await prisma.flashcard.findUnique({
      where: {
        id: flashcardToFind,
      },
    })
    if (searchResult != null) {
      res.render("flashcard/single-flashcard", { flashcardItem: searchResult })
    } else {
      let flashcards = await prisma.flashcard.findMany({
        where: {
          userId: req.user.id,
        },
      })
      res.render("flashcard/index", { flashcards: flashcards })
    }
  },

  create: async (req, res) => {
    const newFlashcard = await prisma.flashcard.create({
      data: {
        question: req.body.question,
        answer: req.body.answer,
        dateCreated: new Date(),
        userId: req.user.id, 
      },
    });

    res.json(newFlashcard);
  },

  edit: async (req, res) => {
    let flashcardToFind = req.params.id
    let searchResult = await prisma.flashcard.findUnique({
      where: {
        id: flashcardToFind,
      },
    })
    res.render("flashcard/edit", { flashcardItem: searchResult })
  },

  update: async (req, res) => {
    try {
      let flashcardToFind = req.params.id
      let flashcard = await prisma.flashcard.findUnique({
        where: {
          id: flashcardToFind,
        },
      })
      if (!flashcard) {
        return res.status(404).send("Flashcard not found")
      }
      let updatedFlashcard = await prisma.flashcard.update({
        where: {
          id: flashcardToFind,
        },
        data: {
          question: req.body.question,
          answer: req.body.answer,
        },
      })
      res.redirect("/flashcards")
    } catch (error) {
      console.error("Error updating flashcard:", error)
      res.status(500).send("Server Error")
    }
  },

  delete: async (req, res) => {
    let flashcardToFind = req.params.id
    await prisma.flashcard.delete({
      where: {
        id: flashcardToFind,
      },
    })
    res.redirect("/flashcards")
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

module.exports = flashcardsController
