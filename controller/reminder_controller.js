let database = require("../models/userModel").database
const userController = require("../controller/userController")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
// import EditorJS from "@editorjs/editorjs";

let remindersController = {
  list: async (req, res) => { //Fully migrated
    // This section finds the reminders that belongs to the user.
    if (!req.user) {
      return res.redirect("/login");
    }

    let reminders = await prisma.reminder.findMany({
      where: {
        userId: req.user.id,
      },
    })

    if(reminders.length === 0){
      return res.redirect("/login")
    }
    // Debugging purposes
    // console.log(req.user.id)
    // console.log(reminders)
    if (req.user && req.user.role === "admin") {
        return res.redirect('/admin')
    } else if (req.user && req.user.role === "regular") {
      // Pass the fetched reminders to the view
      const date = new Date();
      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

      return res.render("reminder/index", { reminders: reminders , daysInMonth : daysInMonth});
    } else {
      return res.redirect("/login")
    }
  },

  // ... rest of your code


  new: (req, res) => {//seperate function
    res.render("reminder/create")
  },

  listOne: async (req, res) => {//Fully migrated
    let reminderToFind = req.params.id
  
    let searchResult = await prisma.reminder.findUnique({
      where: {
        id: reminderToFind,
      },
    })
  
    if (searchResult != null) {
      res.render("reminder/single-reminder", { reminderItem: searchResult })
    } else {
      let reminders = await prisma.reminder.findMany({
        where: {
          userId: req.user.id,
          dateDue: new Date(year, month - 1, day),  // JavaScript's Date object uses 0-based months
        },
      })
      res.render("reminder/index", { reminders: reminders })
    }
  },

  create: async (req, res) => { //Fully Migrated
    
    let reminderData = {
      title: req.body.title,
      description: req.body.description,
      completed: false,
      userId: req.user.id,
      dateCreated: new Date()
    }
  
    if (req.body.dateDue) {
      let dateDue = new Date(req.body.dateDue);
      dateDue.setHours(0);
      dateDue.setMinutes(0);
      dateDue.setSeconds(0);
      dateDue.setMilliseconds(0);
      reminderData.dateDue = dateDue;
    } else {
      reminderData.dateDue = null 
    }
  
    let newReminder = await prisma.reminder.create({
      data: reminderData
    })
  
    res.redirect("/reminders")
  },

  edit: async (req, res) => { // Fully Migrated
    let reminderToFind = req.params.id
    let searchResult = await prisma.reminder.findUnique({
      where: {
        id: reminderToFind,
      },
    })
    res.render("reminder/edit", { reminderItem: searchResult })
  },

  update: async (req, res) => {
    try {
      let reminderToFind = req.params.id
      let reminder = await prisma.reminder.findUnique({
        where: {
          id: reminderToFind,
        },
      })

      if (!reminder) {
        return res.status(404).send("Reminder not found")
      }
      let updatedReminder = await prisma.reminder.update({
        where: {
          id: reminderToFind,
        },
        data: {
          title: req.body.title,
          description: req.body.description,
          completed: req.body.completed === "true",
        },
      })

      res.redirect("/reminders")
    } catch (error) {
      console.error("Error updating reminder:", error)
      res.status(500).send("Server Error")
    }
  },


  delete: async (req, res) => {
    let reminderToFind = req.params.id
    await prisma.reminder.delete({
      where: {
        id: reminderToFind,
      },
    })
    res.redirect("/reminders")
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

module.exports = remindersController