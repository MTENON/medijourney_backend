var express = require('express');
var router = express.Router();

const { checkBody } = require('../functions/checkbody');

const User = require('../models/User');
const { mongoose } = require('mongoose');

router.post('/signin', async (req, res) => {

  if (checkBody(req.body, ['username', 'password', 'confirmPassword'] || checkBody(req.body, ['email', 'password', 'confirmPassword']))) {

    const usernamePattern = /^[a-zA-Z0-9]{4,10}$/g;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if ((usernamePattern.test(req.body.username)
      && passwordPattern.test(req.body.password)
      && passwordPattern.test(req.body.confirmPassword))
      ||
      (emailPattern.test(req.body.email)
        && passwordPattern.test(req.body.password)
        && passwordPattern.test(req.body.confirmPassword))) {

      if (req.body.password !== req.body.confirmPassword) {
        res.json({ result: false, data: "passwords are not the same" })
      }

      const data = await User.findOne({
        $or:
          [{ username: req.body.username },
          { email: req.body.username }]
      });

      res.json({ result: true, data })

    } else {
      res.status(500);
      res.json({ result: false, data: "pattern returned false" })
    }

  } else {
    res.status(500);
    res.json({ result: false, data: "checkBody returned false" })
  }
})

module.exports = router;
