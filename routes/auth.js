const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

//REGISTER

router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post('/login', async (req, res) => {
  try {
    const userLogin = await User.findOne({
      email: req.body.email,
    });
    !userLogin && res.status(401).json('Wrong credientials!');

    const hashedPassword = CryptoJS.AES.decrypt(
      userLogin.password,
      process.env.PASSWORD_SECRET
    );
    const loginPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    loginPassword !== req.body.password &&
      res.status(401).json('Wrong credientials!');

    // using a jsonwebtoken for securing our data for accessibility
    const accessToken = jwt.sign(
      {
        id: userLogin._id,
        isAdmin: userLogin.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    // send all information to the user but no password
    const { password, ...others } = userLogin._doc;

    // While all data are right return
    res.status(200).json({ others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
