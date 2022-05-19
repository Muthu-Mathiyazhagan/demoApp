const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const {
  userSchemaJoi,
  addressSchemaJoi,
  Address,
  User,
} = require("../models/user");

router.use(express.json());

router.get("/", async (req, res) => {
  let addresses = await Address.find({
    userId: req.body.userId,
  });
  if (!req.body.home) {
    
  }
  return res.status(200).send(`${addresses}`);
});

router.post("/", async (req, res) => {
  let { error } = userSchemaJoi.validate(req.body.user);
  if (error)
    return res.status(400).send(`${error.details[0].message} : User Validate`);
  let user = await User.findOne({ email: req.body.user.email });
  if (user)
    return res.status(400).send(`User Already Registered.! "${user.email}"`);
  user = new User(_.pick(req.body.user, ["name", "email", "phone"]));

  user = await user.save();
  console.log(user + " saved successfully");

  console.log(req.body.addresses.length);
  //   return res.status(200).send(user._id);
  let count = 0;
  for (let index = 0; index < req.body.addresses.length; index++) {
    let address = req.body.addresses[index];
    let id = user._id.toString();
    address.userId = id.split('"')[0];
    console.log("address.userId: " + address.userId);

    console.log(address);

    let { error } = addressSchemaJoi.validate(address);
    if (error) {
      console.log(error);
      User.findByIdAndRemove(user._id)
        .then(() => {
          return res
            .status(500)
            .send("Something went wrong : Error on Validate address" + error);
        })
        .catch((ex) => {
          return res
            .status(500)
            .send("Something went wrong : Error on Remove user" + error + ex);
        });
      return res
        .status(400)
        .send(errorA.details[0].message + "Address: \n" + address);
    }

    address = new Address(address)
      .save()
      .then(() => {
        count++;
        console.log(count);
        if (req.body.addresses.length == count) {
          console.log(count);
          return res
            .status(200)
            .send(_.pick(user, ["name", "email", "phone", "-__v"]));
        }
      })
      .catch((ex) => {
        User.findByIdAndRemove(user._id).then(() => {
          return res
            .status(400)
            .send(`Something went wrong : Save Address : ${ex}`);
        });
      })
      .catch((ex) => {
        return res
          .status(400)
          .send(`Something went wrong : Save Address : ${ex}`);
      });
  }
});

module.exports = router;
