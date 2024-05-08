let database = require("../models/userModel").database;

let remindersController = {
  list: (req, res) => {
    // console.log(req.user)
    if (req.user && req.user.role === "admin") {
        res.redirect('/admin');
    } else if (req.user && req.user.role === "regular") {
      res.render("reminder/index", { reminders: req.reminders });
    } else {
      res.redirect("/login");
    }
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: async (req, res) => {
    let reminderToFind = req.params.id;
  
    let searchResult = await prisma.reminder.findUnique({
      where: {
        id: parseInt(reminderToFind),
      },
    });
  
    if (searchResult != null) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      let reminders = await prisma.reminder.findMany({
        where: {
          userId: req.user.id,
        },
      });
      // Don't know if I should use req.user.reminders here
      res.render("reminder/index", { reminders: reminders });
    }
  },

  create: async (req, res) => {
    let reminder = await prisma.reminder.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        completed: false,
        userId: req.user.id,
      },
    });

    res.redirect('/reminder/' + reminder.id);
  },

  edit: async (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = await prisma.reminder.findUnique({
      where: {
        id: parseInt(reminderToFind),
      },
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: async (req, res) => {
    try {
      let reminderToFind = req.params.id;
      let reminder = await prisma.reminder.findUnique({
        where: {
          id: parseInt(reminderToFind),
        },
      });

      if (!reminder) {
        return res.status(404).send("Reminder not found");
      }
      let updatedReminder = await prisma.reminder.update({
        where: {
          id: parseInt(reminderToFind),
        },
        data: {
          title: req.body.title,
          description: req.body.description,
          completed: req.body.completed === "true",
        },
      });

      res.redirect("/reminders");
    } catch (error) {
      console.error("Error updating reminder:", error);
      res.status(500).send("Server Error");
    }
  },

  delete: async (req, res) => {
    let reminderToFind = req.params.id;
    await prisma.reminder.delete({
      where: {
        id: parseInt(reminderToFind),
      },
    });
    res.redirect("/reminders");
  },
  admin: (req, res) => {
  
    req.sessionStore.all((err, sessions) => {
      if (err) {
        console.log(err);
        return res.redirect("/login");
      }
  
      console.log(sessions);
  
      let sessionList = [];
      for (let key in sessions) {
        if (req.user.id != sessions[key].passport.user) {
          console.log(key)
          sessionList.push({"SessionID":key, "UserID":sessions[key].passport.user})
        }
      }
      res.render("admin", { user: req.user, sessions: sessionList });
    });
  
  },
  destroy: (req, res) => {
    const sessionId = req.params.sessionId;
    req.sessionStore.destroy(sessionId, (err) => {
      if (err) {
        console.log(err);
        res.redirect("/admin")
      } else {
        res.redirect('/admin');
      }
    });
  },

  logout: (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        }
        res.redirect('/login'); 
      });
    }

};

module.exports = remindersController;