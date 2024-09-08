var express = require('express');
var router = express.Router();

const { checkBody, capitalize } = require('../functions/functions');

const User = require('../models/User');
const { mongoose } = require('mongoose');

//Imports d'authentification
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

//Patterns
const usernamePattern = /^[a-zA-Z0-9]{4,10}$/;
const namePattern = /^[a-zA-Z]+$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const datePattern = /^([1-9]|0[1-9]|[12][0-9]|3[0-1])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/;

router.post('/signin', async (req, res) => {

  if (checkBody(req.body, ['username', 'password'] || checkBody(req.body, ['email', 'password']))) {

    if ((usernamePattern.test(req.body.username)
      && passwordPattern.test(req.body.password))
      ||
      (emailPattern.test(req.body.email)
        && passwordPattern.test(req.body.password))) {

      const userData = await User.findOne({
        $or:
          [{ username: req.body.username },
          { email: req.body.username }]
      });

      //METTRE DANS DATA LE BESOIN DU REDUCER
      res.json({ result: true, data: { username: userData.username, token: userData.token } })

    } else {
      res.status(500);
      res.json({ result: false, data: "pattern returned false" })
    }

  } else {
    res.status(500);
    res.json({ result: false, data: "checkBody returned false" })
  }
});

router.post('/signup', async (req, res) => {

  try {

    if (!checkBody(req.body, ['username', 'firstName', 'lastName', 'birthdate', 'email', 'password', 'confirmPassword',])) {
      res.json({ result: false, data: 'checkbody returned false' });
    };



    if (!(usernamePattern.test(req.body.username)
      && namePattern.test(req.body.firstName)
      && namePattern.test(req.body.lastName)
      && datePattern.test(req.body.birthdate)
      && passwordPattern.test(req.body.password)
      && passwordPattern.test(req.body.confirmPassword)
      && emailPattern.test(req.body.email))) {

      console.log(req.body.lastName, namePattern.test(req.body.lastName), req.body.lastName, namePattern.test(req.body.lastName));

      res.json({
        result: false,
        data: "patterns returned false",
        patterns: {
          username: usernamePattern.test(req.body.username),
          firstName: namePattern.test(req.body.firstName),
          lastName: namePattern.test(req.body.lastName),
          DDN: datePattern.test(req.body.birthdate),
          PSW: passwordPattern.test(req.body.password),
          cPSW: passwordPattern.test(req.body.confirmPassword),
          email: (emailPattern.test(req.body.email)),
        }
      });

      return;

    }

    if (req.body.password !== req.body.confirmPassword) {
      res.json({ result: false, data: "passwords are not the same" });
      return;
    };

    //User already exist?
    const userExist = await User.findOne({
      $or:
        [{ username: req.body.username },
        { email: req.body.username }]
    });

    if (userExist) {
      res.json({ result: false, data: 'User already exist' });
      return;
    }

    //Création du nouveau compte avec les informations utilisateurs
    const newUser = new User({
      username: req.body.username,
      firstName: capitalize(req.body.firstName),
      lastName: capitalize(req.body.lastName),
      DDN: new Date(req.body.birthdate),
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      token: uid2(32)
    });

    await newUser.save();

    const userData = await User.findOne({ username: req.body.username });

    res.json({ result: true, data: { username: userData.username, token: userData.token } });

  } catch (error) {
    console.error(error.message);
    res.json({ result: false, error: error.message });
  }

})

module.exports = router;
