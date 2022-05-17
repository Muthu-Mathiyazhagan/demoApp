const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    minlength: 4,
    maxlength: 50,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    minlength: 9,
    maxlength: 15,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
const Address = mongoose.model(
  "Address",
  new mongoose.Schema({
    id: {
      type: String,
      required: true,
    },

    addressLine1: {
      type: String,
      maxlength: 50,
      required: true,
    },
    addressLine2: {
      type: String,
      maxlength: 50,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      maxlength: 15,
      required: true,
    },
    postalCode: {
      type: String,
      maxlength: 15,
      required: true,
    },
    country: {
      type: String,
      maxlength: 15,
      required: true,
    },
  })
);

const userSchemaJoi = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().min(3).required().email(),
  phone: Joi.string().min(9).required(),
});

const addressSchemaJoi = Joi.object({
  userId: Joi.objectId().required(),
  type: Joi.string().required(),
  addressLine1: Joi.string().max(255).required(),
  addressLine2: Joi.string().max(255).required(),
  city: Joi.string().max(255).required(),
  postalCode: Joi.string().max(9).required(),
  country: Joi.string().required(),
});

exports.userSchemaJoi = userSchemaJoi;
exports.addressSchemaJoi = addressSchemaJoi;
exports.User = User;
exports.Address = Address;
