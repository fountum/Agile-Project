const express = require('express');
const router = express.Router();
const reminderController = require('../controller/reminder_controller');
const { ensureAuthenticated } = require('../middleware/checkAuth.js');

function ensureAuthenticatedForCreate(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('reminder/index');
  }
}

router.get("/", reminderController.list);
router.get("/reminders", reminderController.list);
router.get("/admin", reminderController.admin);
router.get("/destroy/:sessionId", reminderController.destroy);
router.get("/reminder/new", reminderController.new);
router.get("/reminder/:id", reminderController.listOne);
router.get("/reminder/:id/edit", reminderController.edit);
router.get("/logout", reminderController.logout);
router.get('/reminders/:date', async (req, res) => {
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
      userId: req.user.id
    }
  });

  console.log('reminders:', reminders);

  res.json(reminders);
});

router.post("/reminder/", ensureAuthenticatedForCreate, reminderController.create);
router.post("/reminder/update/:id", reminderController.update);
router.post("/reminder/delete/:id", reminderController.delete);
router.post("/destroy/:sessionId", reminderController.destroy);
router.post("/logout", reminderController.logout);

module.exports = router;