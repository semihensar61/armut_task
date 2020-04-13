const express = require("express");

const router = express.Router();
const checkauth = require("../middlewares/checkauth");

const Message = require("../models/messages");
const User = require("../models/users");
const Logs = require("../models/logs");

router.post("/", checkauth, (req, res) => {
  console.log(req.userData); // loged user date from checkout middleware, if user is not logged in checkout prevent funtion to run.

  const username_to_send = req.body.username; // user name of the user who message will be sent to.
  const message = req.body.message;

  User.find({ username: username_to_send }).then(r => {
    if (r.length == 0) {
      //check if the reciever exists.
      const log = {
        log_type: 0,
        log_route: "send",
        log_user: req.userData.username,
        log_detail:
          req.userData.username + " tried to send message no existing user"
      };
      Logs.create(log).then(() => {
        res
          .status(409)
          .json({
            msg: "There is no user called by " + username_to_send,
            status: 0
          })
          .end();
      });
    } else {
      User.findOne({ username: username_to_send }).then(username_to_send => {
        if (username_to_send.blockedUsers.includes(req.userData.username)) {
          //this means that sender is blocked by reciever.
          const log = {
            log_type: 0,
            log_route: "send",
            log_user: req.userData.username,
            log_detail:
              req.userData.username + " tried to send message blocked user"
          };
          Logs.create(log).then(() => {
            res
              .status(400)
              .json({
                msg: "You are blocked by " + username_to_send,
                status: 0
              })
              .end();
          });
        } else {
          const newMessage = {
            send_from: req.userData.username,
            send_to: username_to_send,
            message: message
          };
          newMessage.createdAt = new Date();

          try {
            Message.create(newMessage).then(() => {
              const log = {
                log_type: 0,
                log_route: "send",
                log_user: req.userData.username,
                log_detail:
                  req.userData.username + " sent message to " + username_to_send.name
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
          } catch (err) {
            const log = {
              log_type: 0,
              log_route: "send",
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
        }
      });
    }
  });
});

module.exports = router;
