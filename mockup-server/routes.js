const express = require("express");

const { notification } = require("./mocks");
const router = express.Router();

//console.log("MOCK ", notification)
router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});


router.get("/new-notification", (req, res) => {
  //console.log("REQ ", typeof req.app.get("io"));
  const io = req.app.get("io");
  io.emit("FromAPI", notification);
  //req.app.io.emit('tx', {key:"value"});
  res.send({ response: "Notification...." }).status(200);
});


module.exports = router;