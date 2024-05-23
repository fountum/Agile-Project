const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

let flashcardsController = {
  list: async (req, res) => {
      let flashcards = await prisma.flashcard.findMany({
        where: {
          userId: req.user.id,
        },
      })
      res.render("flashcards/flashcards", { flashcards: flashcards })
  },
  new: async (req, res) => {
    let flashcards = await prisma.flashcard.findMany({
      where: {
        userId: req.user.id,
      },
    })
  
    res.render("flashcards/flashcard_create", { flashcards:flashcards })
  },

  listOne: async (req, res) => {
    try{
      let flashcardToFind = req.params.id
      let searchResult = await prisma.flashcard.findUnique({
        where: {
          id: flashcardToFind,}
      });
      if (searchResult != null) {
        res.render("flashcard/single-flashcard", { flashcardItem: searchResult })
      } else {
        let flashcards = await prisma.flashcard.findMany({
          where: {
            userId: req.user.id,
          },
        });
        res.render("flashcard/index", { flashcards: flashcards })
      }
    }catch (error) {
      console.error("Error fetching flashcard:", error);
      res.status(500).send("Server Error");
    }
  },

  create: async (req, res) => {
    try{
      const newFlashcard = await prisma.flashcard.create({
        data: {
          question: req.body.question,
          answer: req.body.answer,
          userId: req.user.id, 
        },
      });

      res.redirect("/flashcards")
    }catch (error) {
      console.error("Error creating flashcard:", error);
      res.status(500).send("Server Error");
    }
  },

  edit: async (req, res) => {
    try {
      let flashcardToFind = req.params.id;
      let searchResult = await prisma.flashcard.findUnique({
        where: { id: flashcardToFind },
      });

      if (searchResult) {
        res.render("flashcards/flashcard_edit", { flashcardItem: searchResult });
      } else {
        res.status(404).send("Flashcard not found");
      }
    } catch (error) {
      console.error("Error fetching flashcard:", error);
      res.status(500).send("Server Error");
    }
  },


  update: async (req, res) => {
    try {
      let flashcardToFind = req.params.id;
      let flashcard = await prisma.flashcard.findUnique({
        where: { id: flashcardToFind },
      });

      if (!flashcard) {
        return res.status(404).send("Flashcard not found");
      }

      let updatedFlashcard = await prisma.flashcard.update({
        where: { id: flashcardToFind },
        data: {
          question: req.body.question,
          answer: req.body.answer,
        },
      });

      res.redirect("/flashcards");
    } catch (error) {
      console.error("Error updating flashcard:", error);
      res.status(500).send("Server Error");
    }
  },

  delete: async (req, res) => {
    try {
      let flashcardToFind = req.params.id;
      await prisma.flashcard.delete({
        where: { id: flashcardToFind },
      });
      res.redirect("/flashcards");
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      res.status(500).send("Server Error");
    }
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
