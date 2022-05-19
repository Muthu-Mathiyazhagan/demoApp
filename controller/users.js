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

router.post("/", async (req, res) => {
  //   return res.status(200).send("Am working.. :)");
  //   console.log(req.body.user);
  //   console.log(req.body.addresses[1]);
  //   return res.status(200).send("Am working.. :)");

  let { error } = userSchemaJoi.validate(req.body.user);
  if (error)
    return res.status(400).send(`${error.details[0].message} : User Validate`);
  let user = await User.findOne({ email: req.body.user.email });
  if (user)
    return res.status(400).send(`User Already Registered.! "${user.email}"`);
  user = new User(_.pick(req.body.user, ["name", "email", "phone"]));

  user = await user.save();
  console.log(user + " saved successfully");
  let id = user._id.toString();
  console.log(req.body.addresses.length);
  //   return res.status(200).send(user._id);
  let count = 0;
  for (let index = 0; index < req.body.addresses.length; index++) {
    let address = req.body.addresses[index];
    // address.userId = "62839e51738e49e4661e3972";

    address.userId = id.split('"')[0];
    console.log("address.userId: " + address.userId);

    console.log(address);

    let { error: errorA } = addressSchemaJoi.validate(address);
    if (errorA) {
      console.log("Error at 39", errorA);
      User.findByIdAndRemove(user._id)
        .then((result) => {
          return res
            .status(500)
            .send("Something went wrong : Error on Validate address" + errorA);
        })
        .catch((ex) => {
          return res
            .status(500)
            .send("Something went wrong : Error on Remove user" + errorA + ex);
        });
      return res
        .status(400)
        .send(errorA.details[0].message + "Address: \n" + address);
    }

    address = new Address(address)
      .save()
      .then((result) => {
        count++;
        if (req.body.addresses.length == count) {
          console.log(count);
          return res.status(200).send(user);
        }
      })
      .catch((saveError) => {
        User.findByIdAndRemove(user._id).then((result) => {
          return res
            .status(400)
            .send(`Something went wrong : Save Address : ${saveError}`);
        });
      })
      .catch((errorOnRemove) => {
        return res
          .status(400)
          .send(`Something went wrong : Save Address : ${errorOnRemove}`);
      });
  }
});



module.exports = router;
