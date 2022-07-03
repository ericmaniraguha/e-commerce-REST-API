const User = require('../models/User');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./middleware/verifyToken');

const router = require('express').Router();

//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE METHOD - with a role admin can delete a user

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER METHOD FOR ADMIN ONLY
router.get('/findone/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const oneUser = await User.findById(req.params.id);
    const { password, ...others } = oneUser._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USERS AS FOR ADMIN ONLY
router.get('/', verifyTokenAndAdmin, async (req, res) => {
  try {
    const allUsers = await User.find();

    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
