// THIS IS A TEST - Andrei Jan Mendoza
const express = require("express")
const app = express()
const path = require("path")
const ejsLayouts = require("express-ejs-layouts")
// const reminderController = require("./controller/reminder_controller")
// const authController = require("./controller/auth_controller")
const session = require("express-session")
const passport = require("./middleware/passport")
const { database } = require('./models/userModel.js') 
const { ensureAuthenticated } = require('./middleware/checkAuth.js')
// PLESLKDJF:LSDKJF:SLDJF:SDLKFJ:LSDKFJ:LSDKKJF:LSDFJ:LSDJF:LKSKFJ:KLSDJ
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const reminderRoutes = require('./routes/reminders.js')
const authRoutes = require('./routes/auth.js')

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

// function ensureAuthenticatedForCreate(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next()
//   } else {
//     res.redirect('reminder/index')
//   }
// }
// //Deals with the CRUD method of GET
// app.get("/", reminderController.list) 
// app.get("/reminders", reminderController.list)
// app.get("/admin", reminderController.admin)
// app.get("/destroy/:sessionId", reminderController.destroy) 
// app.get("/reminder/new", reminderController.new)
// app.get("/reminder/:id", reminderController.listOne)
// app.get("/reminder/:id/edit", reminderController.edit)
// app.get("/logout", reminderController.logout)
// app.get("/register", authController.register)
// app.get("/login", authController.login)


// async function getRemindersForDate(dateString) {
//   let date = new Date(dateString);
//   let isoDate = date.toISOString();
//   const reminders = await prisma.reminder.findMany({
//     where: {
//       dateDue: isoDate
//     }
//   });
//   return reminders;
// }
// app.get('/reminders/:date', async (req, res) => {
//   let date = new Date(req.params.date);
//   date.setHours(0);
//   date.setMinutes(0);
//   date.setSeconds(0);
//   date.setMilliseconds(0);

//   console.log('date:', date);
//   console.log('userId:', req.user.id);

//   let reminders = await prisma.reminder.findMany({
//     where: {
//       dateDue: date,
//       userId: req.user.id  // Replace with the actual user ID
//     }
//   });

//   console.log('reminders:', reminders);

//   res.json(reminders);
// });

// //Deals with the CRUD method of POST
// app.post("/reminder/", ensureAuthenticatedForCreate,reminderController.create)
// app.post("/reminder/update/:id", reminderController.update)
// app.post("/reminder/delete/:id", reminderController.delete)
// app.post("/destroy/:sessionId", reminderController.destroy)
// app.post("/logout", reminderController.logout)
// app.post("/register", authController.registerSubmit)
// app.post("/login", authController.loginSubmit)

app.use('/', reminderRoutes);
app.use('/', authRoutes);

app.listen(3090, function () {
  console.log(passport.session())
  console.log(
    "Server running. Visit: http://localhost:3090/login in your browser 🚀"
  )
})
