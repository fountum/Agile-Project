const userController = require("../controller/userController")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const ObjectId = require('mongodb').ObjectId;

// ...
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


  new: (req, res) => {
    res.render("notes/create")
  },

  create: async (req, res) => { //Fully Migrated
    
    let note = {
      title: req.body.title,
      content: "New Note! Write Something",
      userId: req.user.id,
      dateCreated: new Date()
    }
  
    
  
    let notes = await prisma.note.create({
      data: note
    })
  
    res.redirect("/reminders")
  },
  

  edit: async (req, res) => { // Fully Migrated
    let reminderToFind = req.params.id
    let note = await prisma.note.findUnique({
      where: {
        id: reminderToFind,
      },
    })
    
    res.render("notes/edit", { note: note })
  },



  share: async (req,res)=>{
    let currentId = req.params.id
    let email = req.body.email
    console.log(currentId)
    console.log(email)

    // This will hold the notes of the persons ID
    let note = await prisma.note.findUnique({
        where:{
            id:currentId
        }
    })

    // This one will be finding the user and their given EMAIL and creating the note with the users ID
    let user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    let create_for_shared_user = await prisma.note.create({

        data: {
            title: note.title,
            content: note.content,
            userId: user.id,
            dateCreated: new Date()
        }
    })
    console.log(note)
    console.log(user)
    console.log(create_for_shared_user)

    res.redirect("/notes")
  
    // ...
  },

  update: async(req,res)=>{
    try {
      let reminderToFind = req.params.id
      let reminder = await prisma.note.findUnique({
        where: {
          id: reminderToFind,
        },
      })

      if (!reminder) {
        return res.status(404).send("Reminder not found")
      }
      let updatedReminder = await prisma.note.update({
        where: {
          id: reminderToFind,
        },
        data: {
          title: req.body.title,
          content: req.body.content,
        },
      })

      res.redirect("/notes")
    } catch (error) {
      console.error("Error updating reminder:", error)
      res.status(500).send("Server Error")
    }
  },
  delete: async (req, res) => {
    let reminderToFind = req.params.id
    await prisma.note.delete({
      where: {
        id: reminderToFind,
      },
    })
    res.redirect("/notes")
  },


}



module.exports = notesController