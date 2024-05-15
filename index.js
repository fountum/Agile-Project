// THIS IS A TEST - Andrei Jan Mendoza
const express = require("express")
const app = express()
const path = require("path")
const ejsLayouts = require("express-ejs-layouts")
const reminderController = require("./controller/reminder_controller")
const authController = require("./controller/auth_controller")

const session = require("express-session")
const passport = require("./middleware/passport")
const { database } = require('./models/userModel.js') 

const noteController = require("./controller/note_controller")
const session = require("express-session")
const passport = require("./middleware/passport")
const methodOverride = require('method-override')
// const { database } = require('./models/userModel.js') 

const { ensureAuthenticated } = require('./middleware/checkAuth.js')
// PLESLKDJF:LSDKJF:SLDJF:SDLKFJ:LSDKFJ:LSDKKJF:LSDFJ:LSDJF:LKSKFJ:KLSDJ
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

//;alsdkjf;alskdjf;asldkjf;asldkjf;laksf


// Deals with the sessions
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
)



app.use(express.static('public'));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(ejsLayouts)
app.use(passport.initialize())
app.use(passport.session())


app.use(methodOverride('_method'))

function ensureAuthenticatedForCreate(req, res, next) {
  if (req.isAuthenticated()) {
    // Add any additional checks or logic here

    return next()
  } else {
    res.redirect('reminder/index')
  }
}
app.get("/", reminderController.list) 
app.get("/reminders", reminderController.list)
app.get("/admin", reminderController.admin)
app.get("/destroy/:sessionId", reminderController.destroy) 
app.get("/reminder/new", reminderController.new)
app.get("/reminder/:id", reminderController.listOne)
app.get("/reminder/:id/edit", reminderController.edit)
app.get("/logout", reminderController.logout)
app.get("/register", authController.register)
app.get("/login", authController.login)


async function getRemindersForDate(dateString) {
  let date = new Date(dateString);
  let isoDate = date.toISOString();
  const reminders = await prisma.reminder.findMany({
    where: {
      dateDue: isoDate
    }
  });
  return reminders;
}
app.get('/reminders/:date', async (req, res) => {
  let date = new Date(req.params.date);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  console.log('date:', date);
  console.log('userId:', req.user.id);

  let reminders = await prisma.reminder.findMany({
    where: {
      dateDue: date,
      userId: req.user.id  // Replace with the actual user ID
    }
  });

  console.log('reminders:', reminders);

  res.json(reminders);
});

//Deals with the CRUD method of POST
app.post("/reminder/", ensureAuthenticatedForCreate,reminderController.create)
app.post("/reminder/update/:id", reminderController.update)
app.post("/reminder/delete/:id", reminderController.delete)
app.post("/destroy/:sessionId", reminderController.destroy)
app.post("/logout", reminderController.logout)
app.post("/register", authController.registerSubmit)
app.post("/login", authController.loginSubmit)
//Provides a GET Method. This grabs the URL and loads the page.
//An action that is done by a button also requires this along with their path.
app.get("/", reminderController.list) 
app.get("/reminders", reminderController.list)
app.get("/admin", reminderController.admin)
app.get("/destroy/:sessionId", reminderController.destroy) // This is a buttoned action, it needs a get and a post
app.get("/reminder/new", reminderController.new)
app.get("/reminder/:id", reminderController.listOne)
app.get("/reminder/:id/edit", reminderController.edit)
app.post("/reminder/", ensureAuthenticatedForCreate,reminderController.create)
// ⭐ Implement these two routes below!
app.post("/reminder/update/:id", reminderController.update)
// AFter a delete has happened, it'll post it, and the redirects
app.post("/reminder/delete/:id", reminderController.delete)
app.post("/destroy/:sessionId", reminderController.destroy)

app.get("/logout", reminderController.logout)
app.post("/logout", reminderController.logout)
app.get("/register", authController.register)
app.post("/register", authController.registerSubmit)
app.get("/login", authController.login)
app.post("/login", authController.loginSubmit)

// Note routes
app.get("/", noteController.list) 
app.get("/notes", noteController.list)
app.get("/admin", noteController.admin)
app.get("/destroy/:sessionId", noteController.destroy)
app.get("/note/new", noteController.new)
app.get("/note/:id", noteController.listOne)
app.get("/note/:id/edit", noteController.edit)
app.post("/note/", ensureAuthenticatedForCreate, noteController.create)
app.put("/note/update/:id", noteController.update)
app.delete("/note/delete/:id", noteController.delete)

app.get("/logout", noteController.logout)
app.post("/logout", noteController.logout)


app.listen(3090, function () {
  console.log(passport.session())
  console.log(
    "Server running. Visit: http://localhost:3090/login in your browser 🚀"
  )
})

