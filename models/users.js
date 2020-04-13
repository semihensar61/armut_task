const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  username: { type: String, required: true },
  accessToken: { type: String, required: true },
  blockedUsers: { type: Array, required: false }
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  find: x => User.find(x),
  findOne: x => User.findOne(x),
  create: newUser => User.create(newUser),
  update: newUser =>
    User.findOneAndUpdate({ _id: newUser._id }, newUser, { upsert: true }),
  User
};
