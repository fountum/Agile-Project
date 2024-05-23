const express = require('express');
const router = express.Router();
const flashcardController = require('../controller/flashcard_controller');

router.get('/flashcards', flashcardController.list);
router.get('/flashcards/new', flashcardController.new);
router.post('/flashcards', flashcardController.create);
router.get('/flashcards/:id', flashcardController.show);
router.get('/flashcards/:id/edit', flashcardController.edit);
router.put('/flashcards/:id', flashcardController.update);
router.delete('/flashcards/:id', flashcardController.delete);

module.exports = router;