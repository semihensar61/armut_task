const express = require("express");

const router = express.Router();
const User = require("../models/users");
const Logs = require("../models/logs");

router.post("/", (req, res) => {
  try {
    const newUser = { ...req.body };
    newUser.createdAt = new Date();
    const authCreds = `${newUser.username}:${newUser.password}`;
    newUser.accessToken = Buffer.from(authCreds).toString("base64");
    newUser.password = undefined;
    try {
      User.find({
        username: newUser.username
      }).then(user => {
        if (user.length == 0) {
          User.create(newUser).then(() => {
            const log = {
              log_type: 0,
              log_route: "register",
              log_user: req.body.username,
              log_detail: req.body.username + " registered into system "
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
        } else {
          const log = {
            log_type: 0,
            log_route: "register",
            log_user: req.body.username,
            log_detail:
              req.body.username +
              " tried to register with username already in use"
          };
          Logs.create(log).then(() => {
            res.status(409).send("Already in use."); //this user name already in use
          });
        }
      });
    } catch (err) {
      const log = {
        log_type: 1,
        log_route: "register",
        log_user: req.userData.username,
        log_detail: err
      };
      Logs.create(log).then(() => {
        res.status(400).send("Invalid options");
      });
    }
  } catch (err) {
    const log = {
      log_type: 1,
      log_route: "register",
      log_user: req.userData.username,
      log_detail: err
    };
    Logs.create(log).then(() => {
      res.status(400).send("Invalid options");
    });
  }
});

module.exports = router;
