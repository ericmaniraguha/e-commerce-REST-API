const mongoose = require('mongoose');


const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
    description: {
      type: String,
      require: true,
    },
    img: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
    },
    size:{
      type:String
    }
    color: {
      type: String,
      required: true,
    },
    price: {
      type:Number, required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
