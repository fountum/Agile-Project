// THIS IS A TEST - Andrei Jan Mendoza
const express = require("express")
const app = express()
const path = require("path")
const ejsLayouts = require("express-ejs-layouts")
const reminderController = require("./controller/reminder_controller")
const authController = require("./controller/auth_controller")
// const noteController = require("./controller/note_controller")
const session = require("express-session")
const passport = require("./middleware/passport")
// const { database } = require('./models/userModel.js') 
const flashcardController = require("./controller/flashcard_controller")

const cors = require('cors');


const methodOverride = require('method-override')
const { ensureAuthenticated } = require('./middleware/checkAuth.js')




const { PrismaClient } = require('@prisma/client')
const flashcardsController = require("./controller/flashcard_controller")

const prisma = new PrismaClient()

//;alsdkjf;alskdjf;asldkjf;asldkjf;laksf


// UNCOMMENT THIS ONCE EVERYTHING IS ALL GOOD TO GO 


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
    },
  }),
  cors()
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

//Provides a GET Method. This grabs the URL and loads the page.
//An action that is done by a button also requires this along with their path.



app.get("/logout", reminderController.logout)
app.post("/logout", reminderController.logout)
app.get("/register", authController.register)
app.post("/register", authController.registerSubmit)
app.get("/login", authController.login)
app.post("/login", authController.loginSubmit)
app.get('/reminders/:date', async (req, res) => {
  const date = req.params.date;
  const reminders = await prisma.reminder.findMany({
    where: {
      dateDue: new Date(date),
    },
  });
  res.json(reminders);
});

// app.get("/notes", noteController.list)

// app.get("/notes/new", noteController.new)
// app.get("/notes/edit/:id", noteController.edit)
// app.post("/notes/update/:id", noteController.update)
// app.post("/notes/delete/:id", noteController.delete)
// // Note routes
// app.get("/notes", noteController.list)
// app.post("/notes/",noteController.create)


app.get('/flashcards', flashcardController.list);
app.get('/flashcards/new', flashcardController.new);
app.post('/flashcards', flashcardController.create);
app.get('/flashcards/edit/:id', flashcardController.edit);
// app.post('/flashcards/update/:id', flashcardController.update);
app.post('/flashcards/delete/:id', flashcardController.delete);
app.post("/flashcards/update/:id", flashcardsController.update)
// app.post("/notes", noteController.list)

// ROUTES FOR THE NOTE TAKING STUFF
// app.get('/notes', (req, res) => {  
//   const userId = req.session.id;
//   res.redirect(`http://localhost:5173?userId=${userId}`);
// });






app.listen(3080, function () {
  console.log(passport.session())
  console.log(
    "Server running. Visit: http://localhost:3080/reminders in your browser 🚀"
  )
})

