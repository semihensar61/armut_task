const express = require("express");

const router = express.Router();
const User = require("../models/users");
const jwt = require("jsonwebtoken");

const Logs = require("../models/logs");

router.post("/", (req, res) => {
  try {
    const body = { ...req.body };
    const accessToken = JSON.parse(JSON.stringify(body)).accessToken;
    const authParams = Buffer.from(accessToken, "base64").toString();
    const username = authParams.substr(0, authParams.indexOf(":"));
    User.findOne({
      username: username
    }).then(userInfo => {
      console.log(userInfo);

      if (userInfo != null && userInfo.accessToken == accessToken) {
        const token = jwt.sign(
          {
            username: username,
            _id: userInfo._id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
          },
          "ArmutTask"
        );
        const log = {
          log_type: 0,
          log_route: "login",
          log_user: req.body.username,
          log_detail: req.body.username + " logged in "
        };
        Logs.create(log).then(() => {
          res
            .status(200)
            .json({
              token: token,
              msg: "logged in"
            })
            .end();
        });
      } else {
        res
          .status(401)
          .json({
            msg: "Unauthorized",
            status: 401
          })
          .end();
      }
    });
  } catch (err) {
    const log = {
      log_type: 1,
      log_route: "login",
      log_user: req.body.username,
      log_detail: err
    };
    Logs.create(log).then(() => {
      res
        .status(400)
        .json({
          msg: "Invalid Options",
          status: 0
        })
        .end();
    });
  }
});

module.exports = router;
