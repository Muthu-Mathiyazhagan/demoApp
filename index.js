const mongoose = require("mongoose");
const express = require("express");
const users = require("./controller/users");

const DbStatus = [
  "Disconnected.",
  "Connected.",
  "Connecting..",
  "Dis Connecting..",
];

const app = express();
app.use(express.json());
app.use("/api/users", users);

mongoose
  .connect("mongodb://localhost/demoApp")
  .then(() => {
    console.log(
      "Mongo DB Conection Status : ",
      DbStatus[mongoose.connection.readyState]
    );
  })
  .catch(() => {
    console.log(
      "Mongo DB Conection Status : ",
      DbStatus[mongoose.connection.readyState]
    );
  });
app.listen(4000, () => console.log(`Listening  On http://localhost`));
