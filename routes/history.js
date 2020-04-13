const express = require("express");

const router = express.Router();
const checkauth = require("../middlewares/checkauth");

const Messages = require("../models/messages");
const Logs = require("../models/logs");

router.get("/", checkauth,  (req, res) => {
  console.log(req.userData); // loged user date from checkout middleware, if user is not logged in checkout prevent funtion to run
  try {
    Messages.find({ send_from: req.userData.username }).then(messages => {
      const log = {
        log_type: 0,
        log_route: "history",
        log_user: req.userData.username,
        log_detail: req.userData.username + " checked message history "
      };
      Logs.create(log).then(() => {
        res
          .status(200)
          .json({
            messages: messages,
            status: 0
          })
          .end();
      });
    });
  } catch (err) {
    const log = {
      log_type: 1,
      log_route: "block",
      log_user: req.userData.username,
      log_detail: err
    };
    Logs.create(log).then(() => {
      res
        .status(400)
        .json({
          msg: "Something went wrong",
          status: 0
        })
        .end();
    });
  }
});

module.exports = router;
