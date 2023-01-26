const UserModel = require("../models/users.model.js");
const crypto = require("crypto");

exports.insert = (req, res) => {
  if (req.body.password.length < 8) {
    return res
      .status(400)
      .send("Password should be at least 8 characters long");
  }
  if (!req.body.username) {
    return res.status(400).send("Username should not be empty");
  }

  let salt = crypto.randomBytes(16).toString("base64");
  let hash = crypto
    .createHmac("sha512", salt)
    .update(req.body.password)
    .digest("base64");
  req.body.password = salt + "$" + hash;
  req.body.status = "user";
  UserModel.createUser(req.body)
    .then((result) => {
      res.status(201).send({ id: result._id });
    })
    .catch((err) => {
      res.send(err.message);
    });
};
