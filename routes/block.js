const express = require("express");

const router = express.Router();
const checkauth = require("../middlewares/checkauth");

const Users = require("../models/users");
const Logs = require("../models/logs");

router.post("/", checkauth, (req, res) => {
  console.log(req.userData); // loged user date from checkout middleware, if user is not logged in checkout prevent funtion to run

  const user_to_block = req.body.username;
  try {
    Users.findOne({ username: req.userData.username }).then(user_to_update => {
      let blocked_users_array = user_to_update.blockedUsers;
      blocked_users_array.push(user_to_block);
      user_to_update.blockedUsers = blocked_users_array;
      Users.update(user_to_update).then(() => {
        const log = {
          log_type: 0,
          log_route: "block",
          log_user: req.userData.username,
          log_detail: req.userData.username + " blocked " + user_to_block
        };
        Logs.create(log).then(() => {
          res
            .status(200)
            .json({
              msg: "Success",
              status: 0
            })
            .end();
        });
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
