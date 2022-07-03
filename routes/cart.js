const Cart = require('../models/Cart');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./middleware/verifyToken');

const router = require('express').Router();

//CREATE CART - ANY USER CAN CREATE A CART
router.post('/', verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const saveCart = await newCart.save();
    res.status(200).json(saveCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//USER CAN UPDATE ITS CART
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updateCart = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE METHOD - with a role admin can delete a product

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json('Cart has been deleted...');
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART  METHOD FOR ADMIN CAN FETCH PRODUCT
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const oneCart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(oneCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL CARTS FOR ADMIN ONLY
router.get('/', verifyTokenAndAuthorization, async () => {
  try {
    const allCarts = await Cart.find();
    res.status(200).json(allCarts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
