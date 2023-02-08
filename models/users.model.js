const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  status: String,
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

const User = mongoose.model("Users", userSchema);

exports.createUser = (userData) => {
  return new User(userData).save();
};

exports.findByEmail = (email) => {
  return User.findOne({ email: email });
};
