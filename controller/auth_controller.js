const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');

let authController = {
  login: (req, res) => {
    res.render('auth/login');
  },

  register: (req, res) => {
    res.render('auth/register');
  },

  loginSubmit: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/reminders',
      failureRedirect: '/login',
    })(req, res, next);
  },

  registerSubmit: async (req, res) => {
    const { name, email, password, re_enter_password } = req.body;

    if (!name || !email || !password || !re_enter_password) {
      res.render('auth/register', {
        message: 'Please enter all fields',
      });
    } else if (password !== re_enter_password) {
      res.render('auth/register', {
        message: 'Passwords do not match',
      });
    } else {
      try {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (existingUser) {
          return res.render('auth/register', {
            message: 'Email already exists',
          });
        }

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password,
            role: 'regular',
            reminders: [],
          },
        });

        console.log('User created:', newUser);

        res.redirect('/login');
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
      }
    }
  },
};

module.exports = authController;